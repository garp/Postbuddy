import { useEffect, useState } from "react";
import {} from "react-icons/ai";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

const AccordionItem = ({
  title,
  content,
  index,
  activeIndex,
  setActiveIndex,
}: any) => {
  const isOpen = index === activeIndex;

  const toggleAccordion = () => {
    setActiveIndex(isOpen ? null : index);
  };

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span>{isOpen ? <FaAngleUp /> : <FaAngleDown />}</span>
      </div>
      {isOpen && <div className="accordion-content">{content}</div>}
    </div>
  );
};

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [button, setButton] = useState("");
  const [buttonData, setButtonData] = useState("");
  const [savedButtonList, setSavedButtonList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const buttonTexts = ["Congratulate", "Thanks", "Good", "Keep Doing", "Ask"];

  useEffect(() => {
    // Retrieve custom buttons from Chrome's sync storage on component mount
    chrome.storage.sync.get(["customActions"], function (result) {
      const savedButtons = result.customActions || [];

      // Filter buttons that are not part of the built-in list
      const filteredButtons = savedButtons.filter(
        (btn: any) => !buttonTexts.includes(btn.name)
      );

      // Set the filtered custom buttons to the state
      setSavedButtonList(filteredButtons);
    });
  }, []);

  // Add or update custom button
  function customButtonHandler() {
    if (!button || !buttonData) {
      console.warn("Please enter both a button name and data.");
      return;
    }

    const newButton = { name: button, prompt: buttonData };

    chrome.storage.sync.get(["customActions"], function (result) {
      let existingButtons = result.customActions || [];

      // Edit mode: update the existing button
      if (isEditing && editIndex !== null) {
        existingButtons[editIndex] = newButton;
      } else {
        // Add mode: add a new button
        existingButtons.push(newButton);
      }

      // Save the updated list back to Chrome's sync storage
      chrome.storage.sync.set({ customActions: existingButtons }, function () {
        console.log("Custom button saved/updated:", newButton);

        // Filter and update the savedButtonList state
        const filteredButtons = existingButtons.filter(
          (btn: any) => !buttonTexts.includes(btn.name)
        );
        setSavedButtonList(filteredButtons);

        // Reset the input fields and edit mode
        setButton("");
        setButtonData("");
        setIsEditing(false);
        setEditIndex(null);
      });
    });
  }

  // Edit custom button
  function editButton(index: number) {
    const buttonToEdit: any = savedButtonList[index];
    setButton(buttonToEdit.name);
    setButtonData(buttonToEdit.prompt);
    setIsEditing(true);
    setEditIndex(index);
  }

  // Delete custom button
  function deleteButton(index: number) {
    chrome.storage.sync.get(["customActions"], function (result) {
      let existingButtons = result.customActions || [];

      // Remove the button at the specified index
      existingButtons.splice(index, 1);

      // Save the updated list back to Chrome's sync storage
      chrome.storage.sync.set({ customActions: existingButtons }, function () {
        console.log("Custom button deleted");

        // Filter and update the savedButtonList state
        const filteredButtons = existingButtons.filter(
          (btn: any) => !buttonTexts.includes(btn.name)
        );
        setSavedButtonList(filteredButtons);

        // Reset the input fields if editing the deleted button
        if (isEditing && editIndex === index) {
          setButton("");
          setButtonData("");
          setIsEditing(false);
          setEditIndex(null);
        }
      });
    });
  }

  const [config, setConfig] = useState<{
    wordLimit: string | null;
    nativeButton: boolean | null;
    toneIntent: string | null;
    replyTone: string | null;
    nativeLanguage: string | null;
  }>({
    wordLimit: null,
    nativeButton: null,
    toneIntent: null,
    replyTone: null,
    nativeLanguage: null,
  });

  useEffect(() => {
    // Retrieve all states from Chrome storage at once
    chrome.storage.sync.get(
      [
        "wordLimit",
        "nativeButton",
        "toneIntent",
        "replyTone",
        "nativeLanguage",
      ],
      (result) => {
        console.log("Result => ", { result });
        setConfig({
          wordLimit: result.wordLimit || "20",
          nativeButton: !!result.nativeButton,
          toneIntent: result.toneIntent || null,
          replyTone: result.replyTone || null,
          nativeLanguage: result.nativeLanguage || null,
        });
      }
    );
  }, []);

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    chrome.storage.sync.set({ [key]: value }, () => {
      console.log(`${key} updated in storage`);
    });
  };

  const updateNativeButton = () => {
    updateConfig("nativeButton", !config.nativeButton);
  };

  const accordionData = [
    {
      title: "ReplyBot configuration",
      content: (
        <div>
          <div>
            {/*Reply tone dropdown */}
            <h3>Word limit</h3>
            <select
              value={config.wordLimit || ""}
              onChange={(e) => updateConfig("wordLimit", e.target.value)}
            >
              <option value="20">less than 20</option>
              <option value="30">between 30 and 50</option>
              <option value="50">more than 50</option>
            </select>

            {/*Reply tone dropdown */}
            <h3>Reply Tone</h3>
            <select
              value={config.replyTone || ""}
              onChange={(e) => updateConfig("replyTone", e.target.value)}
            >
              <option value="">Select Tone</option>
              <option value="Friendly">Friendly</option>
              <option value="Excited">Excited</option>
              <option value="Normal">Normal</option>
              <option value="Funny">Funny</option>
              <option value="Angry">Angry</option>
              <option value="Sad">Sad</option>
              <option value="Mean">Mean</option>
            </select>

            {/*Tone intent */}
            <h3>Tone Intent</h3>
            <select
              name=""
              id=""
              value={config.toneIntent || ""}
              onChange={(e) => updateConfig("toneIntent", e.target.value)}
            >
              <option value="">Select Tone Intent</option>
              <option value="No Intent">No Intent</option>
              <option value="Asking a question">Asking a question</option>
              <option value="Congratulate someone">Congratulate someone</option>
              <option value="State a fact">State a fact</option>
              <option value="Add a new perspective">
                Add a new perspective
              </option>
            </select>

            {/*Native language button */}
            <div className="native-config-container">
              <div className="native-config-button">
                <h4>Use post's native language</h4>
                {/* <button onClick={updateNativeButton}>
                  {config.nativeButton ? "Enabled" : "Disabled"}
                </button> */}
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="native-config-dropdown">
                <select
                  name=""
                  id=""
                  disabled={!config.nativeButton}
                  style={{
                    cursor: `${
                      config.nativeButton ? "pointer" : "not-allowed"
                    }`,
                  }}
                  value={config.nativeLanguage || ""}
                  onChange={(e) =>
                    updateConfig("nativeLanguage", e.target.value)
                  }
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Franch">Franch</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Premium: Custom Buttons (Personalities ✨)",
      content: (
        <div>
          <ul className="custom-button-container">
            {savedButtonList.map((btn: any, index) => (
              <li className="saved-custom-buttons" key={index}>
                <h2>{btn.name}</h2>
                <div className="custom-button-actions">
                  <h2 onClick={() => editButton(index)}>
                    <CiEdit />
                  </h2>
                  <h2 onClick={() => deleteButton(index)}>
                    <MdDeleteForever />
                  </h2>
                </div>
              </li>
            ))}
          </ul>
          <p>Button Name:</p>
          <input
            type="text"
            value={button}
            placeholder="Friendly Comments"
            onChange={(e) => setButton(e.target.value)}
          />
          <p>Write a prompt for your custom button:</p>
          <textarea
            value={buttonData}
            placeholder="Write your prompt here"
            onChange={(e) => setButtonData(e.target.value)}
          />
          <button onClick={customButtonHandler}>
            {isEditing ? "Save Button" : "Add Button"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="accordion">
      {accordionData.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          index={index}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      ))}
    </div>
  );
}
