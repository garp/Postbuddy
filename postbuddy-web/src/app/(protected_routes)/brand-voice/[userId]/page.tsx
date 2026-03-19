"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "@/components/molecules/Home/Navbar";
import { Select, MantineProvider, createTheme, Loader, Switch, Tabs, Modal } from "@mantine/core";
import '@mantine/core/styles.css';
import { useCreateBrandVoiceMutation, useGetBrandVoiceQuery, useActivateBrandVoiceMutation, useDeleteBrandVoiceMutation } from "@/redux/api/services/brandVoice";
import { toast } from "react-hot-toast";
import { IconBuildingStore, IconUser, IconFileText, IconForms } from '@tabler/icons-react';
import { selectStyles, inputClass, errorInputClass } from "@/styles/customStyles";
import { selectData } from "@/constants";
import { ValidationErrors } from "@/types";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSearchParams, useRouter } from "next/navigation";
import ActivateVoice from "@/components/molecules/brandVoice/ActivateVoice";
import DeleteVoice from "@/components/molecules/brandVoice/DeleteVoice";


const theme = createTheme({
  colors: {
    dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113'],
    purple: ['#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87', '#4c1d95'],
  },
  primaryColor: 'purple',
  components: {
    Select: {
      styles: {
        dropdown: { backgroundColor: '#1d1b27', color: 'white' },
        option: {
          color: 'white',
          '&[data-selected]': { color: 'white', backgroundColor: '#7C3AED' },
          '&[data-hovered]': { color: 'white', backgroundColor: '#2C2E33' },
        }
      }
    },
    Tabs: {
      styles: {
        tab: {
          color: 'white',
          '&[dataActive="true"]': { color: 'white', borderColor: '#7C3AED' },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
        }
      }
    }
  }
});

export default function BrandVoicePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string | null>(tabParam || "profile");
  const [createBrandVoice, { isLoading: isLoadingBrandVoice }] = useCreateBrandVoiceMutation();
  const { data: brandVoiceData, isLoading: brandVoiceLoading, refetch } = useGetBrandVoiceQuery({});
  const [activateBrandVoice, { isLoading: isLoadingActivateBrandVoice }] = useActivateBrandVoiceMutation();
  const [deleteBrandVoice, { isLoading: isLoadingDeleteBrandVoice }] = useDeleteBrandVoiceMutation();
  const brandVoice = brandVoiceData?.data;
  const [formData, setFormData] = useState({
    name: "", industry: "", toneOfVoice: "", personality: "", targetAudience: "",
    serviceSkills: "", uniqueStrengths: "", personalBackground: "",
    professionalExperience: "", personalMission: "", brandType: "business"
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [expandedSummary, setExpandedSummary] = useState<number | null>(null);
  const [openActivateModal, setOpenActivateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<number | null>(null);
  const [voiceUniqueId, setVoiceUniqueId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Generated on: ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  };

  const isPersonalBrand = formData.brandType === "personal";
  const fieldLabels = {
    name: isPersonalBrand ? "Your Name" : "Brand Name",
    industry: "Industry",
    toneOfVoice: "Tone of Voice",
    personality: isPersonalBrand ? "Your Personality" : "Brand Personality",
    targetAudience: "Target Audience",
    serviceSkills: isPersonalBrand ? "Your Skills/Services" : "Brand Services/Products",
    uniqueStrengths: isPersonalBrand ? "Your Unique Strengths" : "Brand Unique Selling Points",
    personalBackground: isPersonalBrand ? "Personal Background" : "Brand History/Background",
    professionalExperience: isPersonalBrand ? "Professional Experience" : "Company Experience/Milestones",
    personalMission: isPersonalBrand ? "Personal Mission" : "Brand Mission/Vision"
  };

  const placeholders = {
    name: isPersonalBrand ? "John Smith" : "Acme Corporation",
    industry: "Select industry",
    toneOfVoice: "Select tone",
    personality: "Select personality",
    targetAudience: isPersonalBrand ? "Entrepreneurs, small business owners, etc." : "Mid-sized businesses, enterprise clients, etc.",
    serviceSkills: isPersonalBrand ? "Web development, UI/UX design, SEO optimization" : "Cloud solutions, enterprise software, consulting services",
    uniqueStrengths: isPersonalBrand ? "10+ years experience, innovative problem-solving" : "Patent-pending technology, industry-leading support",
    personalBackground: isPersonalBrand ? "Share details about your personal journey" : "Share the story of how your brand was founded",
    professionalExperience: isPersonalBrand ? "Software engineer at Google, startup founder" : "Launched in 2010, expanded to 5 countries",
    personalMission: isPersonalBrand ? "Helping businesses solve complex problems" : "Revolutionizing industry practices through innovation"
  };

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      switch (name) {
        case 'name': return `${fieldLabels.name} is required`;
        case 'industry': return 'Please select an industry';
        case 'toneOfVoice': return 'Please select a tone of voice';
        case 'personality': return `${fieldLabels.personality} is required`;
        case 'targetAudience': return 'Target audience is required';
        case 'serviceSkills': return `${fieldLabels.serviceSkills} are required`;
        case 'uniqueStrengths': return `${fieldLabels.uniqueStrengths} are required`;
        case 'personalBackground': return `${fieldLabels.personalBackground} is required`;
        case 'professionalExperience': return `${fieldLabels.professionalExperience} is required`;
        case 'personalMission': return `${fieldLabels.personalMission} is required`;
        default: return '';
      }
    }
    return '';
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) { newErrors[key] = error; isValid = false; }
    });
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return isValid;
  };

  const toggleSummaryExpansion = (index: number) => {
    setExpandedSummary(expandedSummary === index ? null : index);
  };

  // const handleActivateModalOpen = (index: number, id: string) => {
  //   if (isLoadingActivateBrandVoice) return toast.error("Please wait while we activate the voice");
  //   setSelectedVoiceId(index);
  //   setOpenActivateModal(true);
  //   setVoiceUniqueId(id);
  // };

  const handleDeleteModalOpen = (index: number, id: string) => {
    if (isLoadingDeleteBrandVoice) return toast.error("Please wait while we delete the voice");
    setSelectedVoiceId(index);
    setOpenDeleteModal(true);
    setVoiceUniqueId(id);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name as keyof typeof formData]) }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (touched[name]) setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBrandTypeChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, brandType: checked ? "personal" : "business" }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Please enter valid details before submitting");
    try {
      const response = await createBrandVoice(formData);
      if (response?.data) {
        toast.success("Brand voice created successfully");
        handleTabChange("summaries");
      }
      refetch()
    } catch (error) {
      toast.error("Failed to create brand voice");
    }
  };

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);

    // Update URL with new tab parameter
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "profile") {
      params.set("tab", value);
    } else {
      params.delete("tab");
    }

    router.push(`?${params.toString()}`);
  };

  const handleActivateVoice = async (id: string) => {
    try {
      await activateBrandVoice(id);
      await refetch();
      toast.success("Voice activated successfully");
      setOpenActivateModal(false);
    } catch (error) {
      toast.error("Failed to activate voice");
    }
  };

  const handleDeleteVoice = async (id: string) => {
    try {
      await deleteBrandVoice(id);
      await refetch();
      toast.success("Voice deleted successfully");
      setOpenDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete voice");
    }
  };

  return (
    <MantineProvider theme={theme}>
      <head><title>PostBuddy AI - Brand Voice</title></head>
      <div className="bg-[#110f1b] min-h-screen w-full font-Poppins px-4 md:px-6 overflow-hidden">
        <Navbar />
        <div className="max-w-5xl mx-auto py-8">
          <h1 className="text-2xl md:text-3xl text-center font-semibold text-white mb-6">Build Your Brand Voice</h1>

          <Modal
            opened={openActivateModal}
            onClose={() => setOpenActivateModal(false)}
            centered
            title=""
            padding="xl"
            radius="lg"
            size="xl"
            withCloseButton={false}
            overlayProps={{
              backgroundOpacity: 0.75,
              blur: 5,
              color: "#0d0b14"
            }}
            styles={{
              header: { padding: 0, backgroundColor: 'transparent', borderBottom: 'none' },
              content: { backgroundColor: '#15131f', borderRadius: '0.75rem' },
              body: { padding: '24px' },
              inner: { padding: '15px' },
            }}
          >
            <ActivateVoice
              onClose={() => setOpenActivateModal(false)}
              onConfirm={() => handleActivateVoice(voiceUniqueId!)}
              voiceName={selectedVoiceId !== null && brandVoice && brandVoice[selectedVoiceId] ? brandVoice[selectedVoiceId].name : ""}
              isLoadingActivateBrandVoice={isLoadingActivateBrandVoice}
            />
          </Modal>

          <Modal
            opened={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            centered
            title=""
            padding="xl"
            radius="lg"
            size="xl"
            withCloseButton={false}
            overlayProps={{
              backgroundOpacity: 0.75,
              blur: 5,
              color: "#0d0b14"
            }}
            styles={{
              header: { padding: 0, backgroundColor: 'transparent', borderBottom: 'none' },
              content: { backgroundColor: '#15131f', borderRadius: '0.75rem' },
              body: { padding: '24px' },
              inner: { padding: '15px' },
            }}
          >
            <DeleteVoice
              onClose={() => setOpenDeleteModal(false)}
              onConfirm={() => handleDeleteVoice(voiceUniqueId!)}
              voiceName={selectedVoiceId !== null && brandVoice && brandVoice[selectedVoiceId] ? brandVoice[selectedVoiceId].name : ""}
              isLoadingDeleteBrandVoice={isLoadingDeleteBrandVoice}
            />
          </Modal>

          <div className="mb-8">
            <Tabs value={activeTab} onChange={handleTabChange} color="purple" variant="outline" radius="md"
              classNames={{ root: 'w-full', list: 'bg-[#1d1b27]/30 border border-gray-700 rounded-lg p-1 flex', tab: 'flex-1 text-center py-3 font-medium', panel: 'mt-4' }}>

              <Tabs.List>
                <Tabs.Tab value="profile" leftSection={<IconForms size={18} />}>Profile Form</Tabs.Tab>
                <Tabs.Tab value="summaries" leftSection={<IconFileText size={18} />}
                  rightSection={<span className="inline-flex items-center justify-center w-6 h-6 ml-2 text-xs font-semibold text-white bg-purple-700 rounded-full">{brandVoice?.length || 0}</span>}>
                  Summaries
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="profile">
                <div className="mb-8 border border-gray-700 rounded-lg p-4 bg-[#1d1b27]/30">
                  <div className="flex items-center justify-between">
                    <div className="text-white text-lg font-medium">What are you building a voice for?</div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <IconBuildingStore className="text-blue-500" size={20} />
                        <span className="text-gray-200 text-sm">Business/Brand</span>
                      </div>
                      <Switch checked={isPersonalBrand} onChange={(e) => handleBrandTypeChange(e.currentTarget.checked)} color="#473678" size="md" />
                      <div className="flex items-center gap-2">
                        <IconUser className="text-blue-500" size={20} />
                        <span className="text-gray-200 text-sm">Personal Brand</span>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-200 mb-2 font-medium">{fieldLabels.name}</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur}
                        className={`${errors.name ? errorInputClass : inputClass} bg-[#1d1b27] focus:border-purple-700`} placeholder={placeholders.name} />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="industry" className="block text-gray-200 mb-2 font-medium">{fieldLabels.industry}</label>
                      <Select id="industry" name="industry" value={formData.industry} onChange={(v) => handleSelectChange("industry", v)}
                        data={selectData.industry} placeholder={placeholders.industry} styles={{
                          ...selectStyles, input: { ...selectStyles.input, borderColor: errors.industry ? '#EF4444' : '#4B5563' }
                        }} classNames={{ root: 'w-full', wrapper: 'w-full', dropdown: 'text-white', option: 'text-white' }}
                        comboboxProps={{ transitionProps: { transition: 'fade', duration: 200 } }} />
                      {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                    </div>

                    <div>
                      <label htmlFor="toneOfVoice" className="block text-gray-200 mb-2 font-medium">{fieldLabels.toneOfVoice}</label>
                      <Select id="toneOfVoice" name="toneOfVoice" value={formData.toneOfVoice} onChange={(v) => handleSelectChange("toneOfVoice", v)}
                        data={selectData.tone} placeholder={placeholders.toneOfVoice} styles={{
                          ...selectStyles, input: { ...selectStyles.input, borderColor: errors.toneOfVoice ? '#EF4444' : '#4B5563' }
                        }} classNames={{ root: 'w-full', wrapper: 'w-full', dropdown: 'text-white', option: 'text-white' }}
                        comboboxProps={{ transitionProps: { transition: 'fade', duration: 200 } }} />
                      {errors.toneOfVoice && <p className="text-red-500 text-sm mt-1">{errors.toneOfVoice}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="personality" className="block text-gray-200 mb-2 font-medium">{fieldLabels.personality}</label>
                      <Select id="personality" name="personality" value={formData.personality} onChange={(v) => handleSelectChange("personality", v)}
                        data={selectData.personality} placeholder={placeholders.personality} styles={{
                          ...selectStyles, input: { ...selectStyles.input, borderColor: errors.personality ? '#EF4444' : '#4B5563' }
                        }} classNames={{ root: 'w-full', wrapper: 'w-full', dropdown: 'text-white', option: 'text-white' }}
                        comboboxProps={{ transitionProps: { transition: 'fade', duration: 200 } }} />
                      {errors.personality && <p className="text-red-500 text-sm mt-1">{errors.personality}</p>}
                    </div>

                    <div>
                      <label htmlFor="targetAudience" className="block text-gray-200 mb-2 font-medium">{fieldLabels.targetAudience}</label>
                      <textarea id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={handleChange} onBlur={handleBlur} rows={3}
                        className={`${errors.targetAudience ? errorInputClass : inputClass} bg-[#1d1b27] focus:border-purple-700`} placeholder={placeholders.targetAudience}></textarea>
                      {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="serviceSkills" className="block text-gray-200 mb-2 font-medium">{fieldLabels.serviceSkills}</label>
                      <textarea id="serviceSkills" name="serviceSkills" value={formData.serviceSkills} onChange={handleChange} onBlur={handleBlur} rows={3}
                        className={`${errors.serviceSkills ? errorInputClass : inputClass} bg-[#1d1b27] focus:border-purple-700`} placeholder={placeholders.serviceSkills}></textarea>
                      {errors.serviceSkills && <p className="text-red-500 text-sm mt-1">{errors.serviceSkills}</p>}
                    </div>

                    <div>
                      <label htmlFor="uniqueStrengths" className="block text-gray-200 mb-2 font-medium">{fieldLabels.uniqueStrengths}</label>
                      <textarea id="uniqueStrengths" name="uniqueStrengths" value={formData.uniqueStrengths} onChange={handleChange} onBlur={handleBlur} rows={3}
                        className={`${errors.uniqueStrengths ? errorInputClass : inputClass} bg-[#1d1b27] focus:border-purple-700`} placeholder={placeholders.uniqueStrengths}></textarea>
                      {errors.uniqueStrengths && <p className="text-red-500 text-sm mt-1">{errors.uniqueStrengths}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="personalBackground" className="block text-gray-200 mb-2 font-medium">{fieldLabels.personalBackground}</label>
                      <textarea id="personalBackground" name="personalBackground" value={formData.personalBackground} onChange={handleChange} onBlur={handleBlur} rows={3}
                        className={`${errors.personalBackground ? errorInputClass : inputClass} bg-[#1d1b27] focus:border-purple-700`} placeholder={placeholders.personalBackground}></textarea>
                      {errors.personalBackground && <p className="text-red-500 text-sm mt-1">{errors.personalBackground}</p>}
                    </div>

                    <div>
                      <label htmlFor="professionalExperience" className="block text-gray-200 mb-2 font-medium">{fieldLabels.professionalExperience}</label>
                      <textarea id="professionalExperience" name="professionalExperience" value={formData.professionalExperience} onChange={handleChange} onBlur={handleBlur} rows={3}
                        className={`${errors.professionalExperience ? errorInputClass : inputClass} bg-[#1d1b27] focus:border-purple-700`} placeholder={placeholders.professionalExperience}></textarea>
                      {errors.professionalExperience && <p className="text-red-500 text-sm mt-1">{errors.professionalExperience}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="personalMission" className="block text-gray-200 mb-2 font-medium">{fieldLabels.personalMission}</label>
                    <textarea id="personalMission" name="personalMission" value={formData.personalMission} onChange={handleChange} onBlur={handleBlur} rows={3}
                      className={`${errors.personalMission ? errorInputClass : inputClass} bg-[#1d1b27] focus:border-purple-700`} placeholder={placeholders.personalMission}></textarea>
                    {errors.personalMission && <p className="text-red-500 text-sm mt-1">{errors.personalMission}</p>}
                  </div>

                  <div className="flex justify-end mt-8">
                    <button type="submit" disabled={isLoadingBrandVoice}
                      className={`bg-gradient-to-r items-center justify-center duration-300 rounded-[6px] flex from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${isLoadingBrandVoice ? 'w-[120px]' : 'w-auto'}`}>
                      {isLoadingBrandVoice ? <Loader color="white" size="sm" /> : "Generate Brand Summary"}
                    </button>
                  </div>
                </form>
              </Tabs.Panel>

              <Tabs.Panel value="summaries">
                {
                  brandVoiceLoading ? <div className="flex justify-center items-center h-full">
                    <Loader color="white" size="sm" />
                  </div> :
                    <div className="space-y-4">
                      {brandVoice?.length > 0 ? (
                        <>
                          {/* First show active voice */}
                          {brandVoice.map((summary: any) => {
                              const actualIndex = brandVoice.findIndex((item: any) => item._id === summary._id);
                              return (
                                <div key={summary._id} className="border border-gray-700 rounded-xl p-4 bg-[#1d1b27]/30 hover:bg-[#1d1b27]/60 transition-colors">
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-white text-lg font-medium">{summary.name}</h3>
                                      {summary.status === "active" && (
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-600">
                                          Active
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-gray-400 text-sm bg-green-50/10 px-2 py-1 rounded">{formatDate(summary.createdAt)}</span>
                                  </div>
                                  <p
                                    className={`text-gray-300 text-sm overflow-hidden transition-[max-height,opacity] ${expandedSummary === actualIndex
                                      ? 'max-h-[800px] opacity-100 duration-500 ease-out'
                                      : 'max-h-[75px] opacity-90 duration-500 ease-in-out line-clamp-3'
                                      }`}
                                  >
                                    {summary.summary}
                                  </p>
                                  <div className="flex justify-end mt-4 space-x-4">
                                    <button
                                      onClick={() => toggleSummaryExpansion(actualIndex)}
                                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                                    >
                                      {expandedSummary === actualIndex ? "Collapse Summary" : "View Full Summary"}
                                    </button>
                                    {/* {summary.status !== "active" && (
                                      <button
                                        onClick={() => handleActivateModalOpen(actualIndex, summary._id)}
                                        className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                                      >
                                        Use This Voice
                                      </button>
                                    )} */}
                                    <button
                                      onClick={() => handleDeleteModalOpen(actualIndex, summary._id)}
                                      className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-1"
                                    >
                                      <RiDeleteBin6Line /> Delete
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                        </>
                      ) : (
                        <div className="text-center py-16">
                          <p className="text-gray-400 mb-4">No brand voice summaries yet</p>
                          <button onClick={() => handleTabChange("profile")}
                            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                            Create Your First Brand Voice
                          </button>
                        </div>
                      )}
                    </div>
                }
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </div>
    </MantineProvider>
  );
}