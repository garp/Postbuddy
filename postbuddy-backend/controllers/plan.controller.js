import * as PlansService from '../service/payment/plan.service.js';
import { errorHandler, responseHandler } from '../utils/responseHandler.js';
import * as Error from '../middlewares/errorHandler.js'
import axios from 'axios';

export const createPlans = async (req, res) => {
  try {
    const { name, type, features, price, gatewayPlanId, period, interval, currency, gateway } = req.body;

    if (!name || !type || !features || !period || (period !== "lifetime" && !interval) || !currency || !gateway) {
      return responseHandler(null, res, 'Missing required fields', 400);
    }
    console.log('BODY ==>', req.body)

    if (period === 'lifetime') {
      const planData = {
        name,
        type,
        features,
        price,
        plgatewayPlanIdanId: "",
        period,
        interval,
        currency,
        gateway
      }
      const plan = await PlansService.create(planData);
      return responseHandler(plan, res, 'Plan created successfully', 201);
    }
    else if (period === 'basic') {
      const planData = {
        name,
        type,
        features,
        price,
        gatewayPlanId,
        period,
        interval,
        currency,
        gateway
      }
      const plan = await PlansService.create(planData);
      return responseHandler(plan, res, 'Plan created successfully', 201);
    }

    const razorpayPayload = period === "lifetime"
      ? {
        period,
        interval: 1,
        item: {
          name,
          amount: price * 100, // Razorpay expects the amount in paise
          currency,
          description: features.join(', '),
        },
        notes: {
          planId,
          type,
        },
      }
      : {
        period,
        interval,
        item: {
          name,
          amount: price,
          currency,
          description: features.join(', '),
        },
        notes: {
          type,
        },
      };
    const razorpayResponse = await axios.post('https://api.razorpay.com/v1/plans', razorpayPayload, {
      auth: {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_SECRET,
      },
    });

    const planData = razorpayResponse?.data

    const body = {
      name: planData?.item?.name,
      type: type,
      features,
      price,
      gatewayPlanId: planData?.id,
      gateway,
      currency: planData?.item?.currency
    };

    const plan = await PlansService.create(body);
    return responseHandler(razorpayResponse?.data, res, 'Plan created successfully', 201);
  } catch (error) {
    console.error(error.message);

    if (error.response && error.response.data) {
      console.error('Razorpay Error:', error.response.data);
    }

    return responseHandler(null, res, 'Internal server error', 500);
  }
};

export const findAllPlans = async (req, res) => {
  try {
    const { type } = req.query
    let filter = { type: type === "india" ? 'india' : 'global', status: "active" }
    const plans = await PlansService.searchAll(filter, { price: -1 });

    if (!plans || plans.length === 0) {
      return responseHandler(null, res, 'No plans found');
    }

    return responseHandler(plans, res, 200);
  } catch (error) {
    console.error('Error fetching plans:', error.message);
    return errorHandler('ERR_INTERNAL_SERVER', res, 500);
  }
}

export const findPlans = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler('ID Not found', res, 400)
    }

    const plan = await PlansService.findById(id);
    if (!plan) {
      return responseHandler('Plan not found', res, 404);
    }
    return responseHandler(plan, res, 200);
  } catch (error) {
    console.error(error.message);
    errorHandler('ERR_INTERNAL_SERVER', res);
  }
};

export const updatePlans = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
      return responseHandler(null, res, 'Missing required fields');
    }
    const updatedPlan = await PlansService.findOneAndUpdate({ _id: id }, updateData);
    if (!updatedPlan) {
      return responseHandler(null, res, 'Plan not found', 404);
    }
    return responseHandler(updatedPlan, res, 'Plan updated successfully');
  } catch (error) {
    console.error(error.message);
    errorHandler('ERR_INTERNAL_SERVER', res);
  }
};

export const deletePlans = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 'Missing required fields', 400);
    }
    const deleted = await PlansService.remove(id);
    if (!deleted) {
      return responseHandler(res, 'Plan not found', 404);
    }
    return responseHandler(res, 'Plan deleted successfully', 200);
  } catch (error) {
    console.error(error.message);
    errorHandler('ERR_INTERNAL_SERVER', res);
  }
};
