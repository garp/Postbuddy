'use client';
import { useGetOrganizationUsersQuery } from '@/redux/api/services/userManagement';
import { Button, Table, Avatar, Text, Modal, ScrollArea, Tooltip } from '@mantine/core';
import InviteUser from '@/components/atoms/InviteUser';
import { useDisclosure } from '@mantine/hooks';
import { FaArrowRotateRight } from "react-icons/fa6";

export default function UserManagement() {
  const { data, refetch, isLoading } = useGetOrganizationUsersQuery({});
  const organization = data?.data?.[0];
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="p-8 bg-[#110f1b] rounded-xl shadow-xl border-1 border-[#52397d96]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {organization?.organizationName}&apos;s Workspace
          </h2>
          <div className="bg-[#8251FB] h-[80px] w-[150px] absolute blur-[125px] -left-4 -bottom-4"></div>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <Tooltip label="Refresh" position="top" withArrow arrowSize={12} transitionProps={{ duration: 200 }}>
            <Button variant="transparent" p={0} onClick={refetch} className="flex items-center justify-center">
              <FaArrowRotateRight size={32} className={`text-white cursor-pointer ${isLoading ? 'animate-spin' : 'rotate-0'}`} />
            </Button>
          </Tooltip>
          <Button
            color="#8251FB"
            radius="md"
            size="md"
            onClick={open}
            className="transition-all duration-200 hover:scale-105 px-6 py-2"
          >
            Invite User
          </Button>
        </div>
      </div>

      <ScrollArea className="rounded-lg overflow-hidden mb-6">
        <Table
          highlightOnHover
          className="rounded-lg overflow-hidden text-white"
          verticalSpacing="md"
          horizontalSpacing="lg"
        >
          <thead className="bg-[#1e153796] text-sm text-white font-medium">
            <tr>
              <th className="text-left py-4">Avatar</th>
              <th className="text-left py-4">Full Name</th>
              <th className="text-left py-4">Email</th>
              <th className="text-left py-4">Role</th>
            </tr>
          </thead>
          <tbody className="bg-[#1e153730]">
            {organization?.adminDetails && Array.isArray(organization?.adminDetails)
              ? organization?.adminDetails?.map((admin: any) => (
                <tr key={admin._id} className="hover:bg-[#52397d40] transition-all duration-150">
                  <td className="py-3">
                    <Avatar radius="xl" src={admin.profileUrl} alt={admin.fullName} size="md" color="#8251FB" />
                  </td>
                  <td className="py-3">
                    <Text className="font-semibold">{admin.fullName}</Text>
                  </td>
                  <td className="py-3">
                    <Text className="text-gray-300">{admin.email}</Text>
                  </td>
                  <td className="py-3">
                    <Text className="text-[#8251FB] font-medium">Admin</Text>
                  </td>
                </tr>
              ))
              : organization?.adminDetails && (
                <tr key={organization?.adminDetails?._id} className="hover:bg-[#52397d40]">
                  <td className="py-3">
                    <Avatar radius="xl" src={organization?.adminDetails?.profileUrl} alt={organization?.adminDetails?.fullName} size="md" color="#8251FB" />
                  </td>
                  <td className="py-3">
                    <Text className="font-semibold">{organization?.adminDetails?.fullName}</Text>
                  </td>
                  <td className="py-3">
                    <Text className="text-gray-300">{organization?.adminDetails?.email}</Text>
                  </td>
                  <td className="py-3">
                    <Text className="text-[#8251FB] font-medium">Admin</Text>
                  </td>
                </tr>
              )}

            {organization?.membersDetails?.map((member: any) => (
              <tr key={member._id} className="hover:bg-[#52397d40]">
                <td className="py-3">
                  <Avatar radius="xl" src={member.profileUrl} alt={member.fullName} size="md" color="#8251FB" />
                </td>
                <td className="py-3">
                  <Text className="font-semibold">{member.fullName}</Text>
                </td>
                <td className="py-3">
                  <Text className="text-gray-300">{member.email}</Text>
                </td>
                <td className="py-3">
                  <Text className="text-[#8251FB] font-medium">{member.inviteStatus === 'accepted' ? (member.isVerified ? "Member" : 'Verification Pending') : 'Pending'}</Text>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>

      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        radius="lg"
        size="lg"
        overlayProps={{ opacity: 1, blur: 5 }}
        classNames={{
          content: 'bg-[#110f1b] border-2 border-[#52397d96] shadow-lg',
        }}
      >
        <InviteUser onClose={close} refetch={refetch} />
      </Modal>
    </div>
  );
}
