import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdContentCopy, MdOutlineAddCircleOutline } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import toast from 'react-hot-toast';
import {
  useAddApiKeyMutation,
  useGetApiKeyQuery,
  useRemoveApiKeyMutation,
} from '@/redux/api/services/apiKey';
import { IoIosLink } from 'react-icons/io';
import { Select, Tooltip } from '@mantine/core';
import { modelList } from '@/constants';
import { ModelList } from '@/types';
import Link from 'next/link';

export default function ApiKeyBox({ isVisible, containerRef }: any) {
  const [showKey, setShowKey] = useState(false);
  const [addApiKey, { isLoading: addKeyLoading }] = useAddApiKeyMutation();
  const { data } = useGetApiKeyQuery({}, { skip: isVisible });
  const [removeApiKey] = useRemoveApiKeyMutation();
  const [key, setKey] = useState(null);
  const [model, setModel] = useState('');
  const [boxHeight, setBoxHeight] = useState(containerRef?.current?.getClientRects()?.[0]?.height ?? 422);

  useEffect(() => {
    setKey(data?.data?.key);
    switch (data?.data?.model) {
      case 'chatgpt':
        setModel('Chatgpt');
        break;
      case 'gemini':
        setModel('Gemini');
        break;
      case 'claude':
        setModel('Claude');
        break;
      case 'deepseek':
        setModel('Deepseek');
        break;
      default:
        setModel('');
    }
  }, [data?.data]);

  const addKeyHandler = async () => {
    if (addKeyLoading) return;
    if (key === '' || key === null || key === ' ') {
      throw new Error('Please select  Model and Add ApiKey');
    }
    if (model.trim() === '') {
      throw new Error('Please select a Model');
    }

    const res = await addApiKey({ model: model, apiKey: key }).unwrap();
    if (res.status !== 200) {
      throw new Error(res.message || 'Failed to add API key');
    }
    return res;
  };

  const copyKeyHandler = () => {
    if (key) {
      navigator.clipboard
        .writeText(key!)
        .then(() => {
          toast.success('Api Key copied to ClipBoard');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  const removeKeyHandler = async () => {
    setKey(null);
    const inputElement: any = document.querySelector(
      'input[type="text"], input[type="password"]',
    );
    if (inputElement.value === '') {
      return;
    }
    if (inputElement) {
      inputElement.value = '';
    }
    await removeApiKey({}).unwrap();
    toast.success('API Key removed');
  };

  useEffect(() => {
    const el = containerRef?.current;
    if (el) {
      const { height } = el.getBoundingClientRect();
      if (height) setBoxHeight(height);
    }
  }, [containerRef?.current]);

  return (
    <div className={`overflow-y-scroll dashboard-container p-6 md:p-8 rounded-lg`}
      style={{
        height: boxHeight,
      }}
    >
      <h3 className="text-lg md:text-xl font-Poppins font-medium text-white md:mb-6">
        Your API Key
      </h3>
      {/* <p className="">Postbuddy Keys</p> */}
      <div className="bg-[#4c4173] p-4 mb-4 rounded-[4px]">
        <p>Use Ai model that you love. </p>
      </div>
      <div className="flex bg-[#4c4173] mb-4 p-4 w-full gap-2 items-center justify-between rounded-[4px]">
        <div className="flex gap-2">
          <Select
            label=""
            value={model || ''}
            placeholder="Select Model"
            data={['Chatgpt', 'Gemini', 'Claude', 'Deepseek']}
            onChange={(value) => setModel(value ?? '')}
            clearable
          />
          <input
            className="bg-transparent border-b-2 w-[75%] border-[#1a152d] outline-none pl-2"
            type={showKey ? 'text' : 'password'}
            onChange={(e: any) => setKey(e.target.value)}
            value={key || ''}
          />
        </div>
        <div className="flex gap-2 text-xl">
          <Tooltip label={showKey ? "Hide API Key" : "Show API Key"}>
            <button onClick={() => setShowKey(!showKey)} type="button">
              {showKey ? <FaEye /> : <FaEyeSlash />}
            </button>
          </Tooltip>
          <Tooltip label={key ? "Update API Key" : "Add API Key"}>
            <button
              onClick={async () =>
                toast.promise(addKeyHandler(), {
                  loading: 'Adding API Key...',
                  success: (res: any) => res?.message || 'API Key added successfully',
                  error: (err: any) => err?.message || 'Unable to add Api Key',
                })
              }
              className={`${!key ? 'text-sm bg-[#1b152e] p-2 rounded-[5px] xl:w-[100px]' : ''}`}
              disabled={addKeyLoading}
            >
              {key ? <MdOutlineAddCircleOutline /> : 'Add Key'}
            </button>
          </Tooltip>
          {key && (
            <Tooltip label="Copy API Key">
              <button onClick={copyKeyHandler}>
                <MdContentCopy />
              </button>
            </Tooltip>
          )}
          {key && (
            <Tooltip label="Remove API Key">
              <button onClick={removeKeyHandler} className="text-red-500">
                <RiDeleteBin6Line />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="">
        {modelList.map((model: ModelList, index: number) => (
          <div
            key={index}
            className="bg-[#4c4173] p-4 mb-4 rounded-[4px] flex justify-between"
          >
            <div>
              <h1 className="text-lg font-semibold">{model.title}</h1>
              <h2>{model.extra}</h2>
            </div>
            <Link
              href={model?.apiURL}
              target="_blank"
              className="flex items-center gap-1"
            >
              <IoIosLink />
              Get Api Key
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
