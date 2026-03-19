import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Loader, Autocomplete, Select } from '@mantine/core';
import { Line } from 'react-chartjs-2';
import { useGetGraphLtsDataQuery } from '@/redux/api/services/dashboard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useGetUserQuery } from '@/redux/api/services/authApi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

let elemWidth = 1000;

export default function LineChart({ organizationUsers }: { organizationUsers: any }) {
  const pathName = usePathname();
  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [graphDataSet, setGraphDataSet] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>('7 Days');
  const { data: graphData, isSuccess: graphIsSuccess, isLoading: graphIsLoading } = useGetGraphLtsDataQuery({
    userId: selectedUserId,
    startDate: dateValue?.[0]?.toUTCString(),
    endDate: dateValue?.[1] ? new Date(dateValue[1].getTime() + 86400000).toUTCString() : null,
  });

  useEffect(() => {
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);

    setDateValue([startDate, endDate]);
  }, [])


  const { data: userInfo } = useGetUserQuery({});

  const getDurationData = (duration: string) => {
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);

    switch (duration) {
      case '7':
        startDate.setDate(today.getDate() - 5);
        console.log({startDate, endDate})
        break;
      case '14':
        startDate.setDate(today.getDate() - 13);
        break;
      case '30':
        startDate.setDate(today.getDate() - 29);
        break;
      default:
        startDate.setDate(today.getDate() - parseInt(duration));
        break;
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate,
      endDate
    };
  }

  function convertData(data: Record<string, any>) {
    if (!data) return [];
    const convertedData = Object.entries(data).map(([date, values]) => ({
      date,
      linkedin: values.linkedin ?? 0,
      facebook: values.facebook ?? 0,
      whatsapp: values.whatsapp ?? 0,
      youtube: values.youtube ?? 0,
      instagram: values.instagram ?? 0,
      x: values.x ?? 0,
    }));
    return convertedData.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('/'));
      const dateB = new Date(b.date.split('/').reverse().join('/'));
      return dateA.getTime() - dateB.getTime();
    });
  }

  const mappedLabels = graphDataSet?.map((item: any) => item.date);
  const mappedLinkedIn = graphDataSet?.map((item: any) => item.linkedin);
  const mappedFacebook = graphDataSet?.map((item: any) => item.facebook);
  const mappedWhatsapp = graphDataSet?.map((item: any) => item.whatsapp);
  const mappedYoutube = graphDataSet?.map((item: any) => item.youtube);
  const mappedInstagram = graphDataSet?.map((item: any) => item.instagram);
  const mappedX = graphDataSet?.map((item: any) => item.x);

  const data = {
    labels: mappedLabels,
    datasets: [
      {
        label: 'Linkedin Usage',
        data: mappedLinkedIn,
        borderColor: '#0A66C2',
        backgroundColor: 'rgba(10, 102, 194, 0.7)',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#0A66C2',
        pointBorderColor: '#0A66C2',
        pointBorderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#0A66C2',
      },
      {
        label: 'Facebook Usage',
        data: mappedFacebook,
        borderColor: '#1877F2',
        backgroundColor: 'rgba(24, 119, 242, 0.7)',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#1877F2',
        pointBorderColor: '#1877F2',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#1877F2',
      },
      {
        label: 'Whatsapp Usage',
        data: mappedWhatsapp,
        borderColor: '#25D366',
        backgroundColor: 'rgba(37, 211, 102, 0.7)',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#25D366',
        pointBorderColor: '#25D366',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#25D366',
      },
      {
        label: 'Youtube Usage',
        data: mappedYoutube,
        borderColor: '#FF0000',
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#FF0000',
        pointBorderColor: '#FF0000',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#FF0000',
      },
      {
        label: 'Instagram Usage',
        data: mappedInstagram,
        borderColor: '#F58529',
        backgroundColor: 'rgba(245, 133, 41, 0.7)',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#F58529',
        pointBorderColor: '#F58529',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#F58529',
      },
      {
        label: 'X Usage',
        data: mappedX,
        borderColor: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#FFFFFF',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Usage Trend',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Transparent grid lines
        },
        ticks: {
          color: '#ffffff', // White tick labels
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Transparent grid lines
        },
        ticks: {
          color: '#ffffff', // White tick labels
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const el = document.querySelector('.chart-parent');
    elemWidth = el?.getBoundingClientRect().width ?? window.innerWidth - 100;
  }, [pathName]);

  useEffect(() => {
    if (graphData?.data?.dateData) {
      setGraphDataSet(convertData(graphData?.data?.dateData));
    }
  }, [graphData?.data?.dateData, graphIsSuccess]);

  return (
    <div className='w-full h-full chart-parent'>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-lg md:text-xl font-Poppins font-medium text-white mb-4 md:mb-6">PostBuddy Usage</h3>
        <div className='flex flex-row gap-4'>
          {userInfo?.data?.role === 'orgAdmin' && (
            <Autocomplete
              label="Choose a Member"
              placeholder="Choose User"
              data={[
                ...(organizationUsers?.data?.[0]?.adminDetails ?
                  Array.isArray(organizationUsers?.data?.[0]?.adminDetails) ?
                    organizationUsers?.data?.[0]?.adminDetails?.map((item: any) => ({
                      value: item._id,
                      label: item.fullName
                    })) :
                    [{
                      value: organizationUsers?.data?.[0]?.adminDetails?._id,
                      label: organizationUsers?.data?.[0]?.adminDetails?.fullName
                    }]
                  : []),
                ...(organizationUsers?.data?.[0]?.membersDetails?.map((item: any) => ({
                  value: item._id,
                  label: item.fullName
                })) || [])
              ]}
              onChange={(value) => {
                const selectedMember = organizationUsers?.data?.[0]?.membersDetails?.find(
                  (item: any) => item.fullName === value
                );

                if (!selectedMember) {
                  if (Array.isArray(organizationUsers?.data?.[0]?.adminDetails)) {
                    const selectedAdmin = organizationUsers?.data?.[0]?.adminDetails?.find(
                      (item: any) => item.fullName === value
                    );
                    setSelectedUserId(selectedAdmin?._id || null);
                  } else if (organizationUsers?.data?.[0]?.adminDetails?.fullName === value) {
                    setSelectedUserId(organizationUsers?.data?.[0]?.adminDetails?._id || null);
                  } else {
                    setSelectedUserId(null);
                  }
                } else {
                  setSelectedUserId(selectedMember._id || null);
                }
              }}
            />
          )}
          <Select
            label="Choose a Period"
            placeholder="Select Duration"
            data={['7 Days', '14 Days', '30 Days']}
            clearable
            value={selectedPeriod}
            onChange={(value: string | null) => {
              setSelectedPeriod(value);
              if (value) {
                const { startDate, endDate } = getDurationData(value);
                console.log({startDate, endDate})
                setDateValue([startDate, endDate]);
              }
            }}
          />
          <DatePickerInput
            type="range"
            label="Pick dates range"
            placeholder="Pick dates range"
            value={dateValue}
            onChange={(newValue) => {
              setDateValue(newValue);
              setSelectedPeriod(null);
            }}
          />
        </div>
      </div>
      {graphIsLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader color="white" size={'lg'} />
        </div>
      ) : (
        <div className='w-full h-[300px]'>
          <Line data={data} options={options} width={elemWidth} height={300} />
        </div>
      )}
    </div>
  );
}