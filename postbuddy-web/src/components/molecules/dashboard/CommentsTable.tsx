import { useGetCommentsDataQuery } from "@/redux/api/services/dashboard";
import { useState } from "react";
import { Table, Loader, Tooltip, Text, Skeleton, Select, Pagination, Badge } from "@mantine/core";
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";

export default function CommentsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [platform, setPlatform] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetCommentsDataQuery({ page, limit, platform });
  console.log(data?.data);
  const commentsData = data?.data?.data;
  const pagination = data?.data?.pagination;

  const truncateText = (text: string, maxLength: number = 80) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "linkedin":
        return <FaLinkedin className="text-[#0077B5]" size={20} />;
      case "facebook":
        return <FaFacebook className="text-[#1877F2]" size={20} />;
      case "instagram":
        return <FaInstagram className="text-[#E4405F]" size={20} />;
      case "youtube":
        return <FaYoutube className="text-[#FF0000]" size={20} />;
      case "twitter":
      case "x":
        return <FaTwitter className="text-[#1DA1F2]" size={20} />;
      case "whatsapp":
        return <FaWhatsapp className="text-[#25D366]" size={20} />;
      default:
        return null;
    }
  };

  const handleLimitChange = (value: string | null) => {
    if (value) {
      setLimit(Number(value));
      setPage(1); // Reset to first page when changing limit
    }
  };

  const handlePlatformChange = (value: string | null) => {
    setPlatform(value);
    setPage(1); // Reset to first page when changing platform
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);

      // Format for display
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return {
        fullDate: `${month} ${day}, ${year}`,
        time: `${hours}:${minutes}`,
        isToday: isToday(date),
        isYesterday: isYesterday(date)
      };
    } catch (e) {
      return null;
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader color="#8251FB" size="md" />
      </div>
    );
  }

  // Create placeholder rows for loading state
  const renderSkeletonRows = () => {
    return Array(limit).fill(0).map((_, index) => (
      <Table.Tr key={`skeleton-${index}`} className="bg-[#1e153730]">
        <Table.Td className="py-3">
          <Skeleton height={20} width={120} radius="sm" />
        </Table.Td>
        <Table.Td className="py-3">
          <Skeleton height={20} width="100%" radius="sm" />
        </Table.Td>
        <Table.Td className="py-3">
          <Skeleton height={20} width={80} radius="sm" />
        </Table.Td>
        <Table.Td className="py-3">
          <Skeleton height={20} width={100} radius="sm" />
        </Table.Td>
      </Table.Tr>
    ));
  };

  return (
    <div className="bg-[#110f1b] rounded-xl shadow-xl border-1 border-[#52397d96] p-6 w-full max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-xl font-bold text-white">Comments Table</h2>

        <div className="flex items-center gap-4">
          {isFetching && <Loader color="#8251FB" size="sm" />}
          <Select
            label="Choose a platform"
            placeholder="Select platform"
            data={[
              { value: 'linkedin', label: 'LinkedIn' },
              { value: 'facebook', label: 'Facebook' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'x', label: 'Twitter' },
              { value: 'youtube', label: 'Youtube' },
              { value: 'whatsapp', label: 'Whatsapp' },
            ]}
            value={platform}
            onChange={handlePlatformChange}
            styles={{
              input: {
                backgroundColor: '#1e153730',
                color: 'white',
                borderColor: '#52397d96'
              },
              dropdown: {
                backgroundColor: '#fff',
                color: '#222',
                borderColor: '#52397d96'
              },
              option: {
                color: '#222',
                '&[data-selected]': {
                  backgroundColor: '#8251FB',
                  color: 'white'
                },
                '&:hover': {
                  backgroundColor: '#52397d40'
                }
              },
              label: {
                color: 'white'
              }
            }}
          />
          <Select
            label="Comments per page"
            data={[
              { value: '5', label: '5 per page' },
              { value: '10', label: '10 per page' },
              { value: '20', label: '20 per page' },
              { value: '50', label: '50 per page' }
            ]}
            value={limit.toString()}
            onChange={handleLimitChange}
            styles={{
              input: {
                backgroundColor: '#1e153730',
                color: 'white',
                borderColor: '#52397d96'
              },
              dropdown: {
                backgroundColor: '#fff',
                color: '#222',
                borderColor: '#52397d96'
              },
              option: {
                color: '#222',
                '&[data-selected]': {
                  backgroundColor: '#8251FB',
                  color: 'white'
                },
                '&:hover': {
                  backgroundColor: '#52397d40'
                }
              },
              label: {
                color: 'white'
              }
            }}
          />

        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <Table
          highlightOnHover
          className="w-full rounded-lg overflow-hidden text-white"
          verticalSpacing="lg"
          horizontalSpacing="xl"
        >
          <thead className="bg-[#1e153796] text-sm text-white font-medium">
            <tr>
              <th className="text-left py-5 px-4 w-[15%]">Platform</th>
              <th className="text-left py-5 px-4 w-[50%]">Comment</th>
              <th className="text-left py-5 px-4 w-[15%]">Post</th>
              <th className="text-left py-5 px-4 w-[20%]">Date</th>
            </tr>
          </thead>
          <tbody className="bg-[#1e153730]">
            {isFetching ? renderSkeletonRows() : (
              commentsData?.map((comment: any, index: number) => (
                <tr key={index} className="hover:bg-[#52397d40] transition-all duration-150">
                  <td className="py-4 px-4 flex items-center">
                    <Tooltip label={comment?.platform} position="right">
                      <div className="mr-3">
                        {getPlatformIcon(comment?.platform)}
                      </div>
                    </Tooltip>
                    <Text className="capitalize text-gray-300">{comment?.platform}</Text>
                  </td>
                  <td className="py-4 px-4">
                    <Tooltip
                      label={comment?.comment}
                      position="bottom"
                      multiline
                      w={400}
                      withArrow
                      transitionProps={{ duration: 200 }}
                    >
                      <Text className="text-white">
                        {truncateText(comment?.comment, 80)}
                      </Text>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-4">
                    {comment?.postLink ? (
                      <a
                        href={comment.postLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8251FB] hover:text-[#9c77fa] transition-colors duration-150"
                      >
                        View Post
                      </a>
                    ) : comment?.type === 'chat' ? (
                      <span className="text-[#8251FB] hover:text-[#9c77fa] transition-colors duration-150">Chat</span>
                    ) : comment?.type === 'recreate' ? (
                      <span className="text-[#8251FB] hover:text-[#9c77fa] transition-colors duration-150">Recreate</span>
                    ) : (
                      <span className="text-gray-500">No link</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {comment?.date ? (
                      <>
                        {formatDate(comment.date) ? (
                          <div className="flex flex-col">
                            <div className="flex items-center mb-1">
                              <IoCalendarOutline className="text-[#8251FB] mr-2" size={14} />
                              <Text size="sm" className="text-white flex items-center">
                                {formatDate(comment.date)?.isToday ? (
                                  <Badge size="xs" color="#8251FB" className="mr-1">Today</Badge>
                                ) : formatDate(comment.date)?.isYesterday ? (
                                  <Badge size="xs" color="#8251FB" className="mr-1">Yesterday</Badge>
                                ) : null}
                                {formatDate(comment.date)?.fullDate}
                              </Text>
                            </div>
                            <div className="flex items-center">
                              <IoTimeOutline className="text-[#8251FB] mr-2" size={14} />
                              <Text size="sm" className="text-gray-300">
                                {formatDate(comment.date)?.time}
                              </Text>
                            </div>
                          </div>
                        ) : (
                          <Text className="text-gray-400">Invalid date</Text>
                        )}
                      </>
                    ) : (
                      <Text className="text-gray-400">No date</Text>
                    )}
                  </td>
                </tr>
              ))
            )}

            {/* Show empty state if no comments are found */}
            {!isFetching && (!commentsData || commentsData.length === 0) && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-white">
                  No comments found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {pagination && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <div className="flex items-center gap-2">
            <Text className="text-white text-sm">
              Showing page {page} of {pagination?.totalPages || 1}
            </Text>
            <Text className="text-gray-400 text-sm">
              ({pagination?.total || 0} comments total)
            </Text>
          </div>

          <Pagination
            total={pagination?.totalPages || 1}
            value={page}
            onChange={setPage}
            color="#8251fb"
            radius="md"
            withEdges
            siblings={1}
            boundaries={1}
          />
        </div>
      )}
    </div>
  );
}
