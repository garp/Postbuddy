import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { useGetGraphLtsDataQuery } from '@/redux/api/services/dashboard';
import { DatePickerInput } from '@mantine/dates';

const DataTable = () => {
  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [graphDataSet, setGraphDataSet] = useState<any[]>([]);
  const {
    data: graphData,
    isSuccess: graphIsSuccess,
    isLoading: graphIsLoading,
  } = useGetGraphLtsDataQuery({
    startDate: dateValue?.[0]?.toUTCString(),
    endDate: dateValue?.[1]
      ? new Date(dateValue[1].getTime() + 86400000).toUTCString()
      : null,
  });

  function convertData(data: Record<string, any>) {
    if (!data) return [];
    return Object?.entries(data)?.map(([date, values]) => ({
      date,
      linkedin: values.linkedin ?? 0,
      facebook: values.facebook ?? 0,
      whatsapp: values.whatsapp ?? 0,
      youtube: values.youtube ?? 0,
      instagram: values.instagram ?? 0,
      x: values.x ?? 0,
    }));
  }
  const rows = graphDataSet?.map((element) => (
    <Table.Tr key={element.date}>
      <Table.Td>{element.date ?? ''}</Table.Td>
      <Table.Td>{element?.name ?? ''}</Table.Td>
      <Table.Td>{element?.symbol ?? ''}</Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    if (graphData?.data?.dateData) {
      setGraphDataSet(convertData(graphData?.data?.dateData));
    }
  }, [graphData?.data?.dateData, graphIsSuccess]);

  console.log('graphDataSet>>', graphDataSet);

  return graphIsLoading ? null : (
    <div className="w-full h-full chart-parent">
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-lg md:text-xl font-Poppins font-medium text-white mb-4 md:mb-6">
          Data Table
        </h3>
        <DatePickerInput
          type="range"
          label="Pick dates range"
          placeholder="Pick dates range"
          value={dateValue}
          onChange={setDateValue}
        />
      </div>
      <Table striped withRowBorders={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Social Media</Table.Th>
            <Table.Th>Usage</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};

export default DataTable;
