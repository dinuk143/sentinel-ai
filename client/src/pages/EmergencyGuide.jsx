import { useState } from "react";

import {
  FaPhoneAlt,
  FaSearch,
  FaFirstAid,
  FaShieldAlt,
  FaExclamationTriangle,
  FaHeartbeat,
  FaTimes
} from "react-icons/fa";

import "../styles/emergencyGuide.css";

function EmergencyGuide() {
  const [search, setSearch] = useState("");

  // ==========================================
  // EMERGENCY GUIDES
  // ==========================================

  const guides = [
    // ================= MEDICAL =================

    {
      category: "Medical",
      icon: "❤️",
      title: "Heart Attack",
      signs:
        "Chest pressure or pain, sweating, nausea, shortness of breath, or pain spreading to the arm, jaw, back or shoulder.",
      steps: [
        "Call 112 immediately.",
        "Keep the person resting in a comfortable position.",
        "Loosen tight clothing and keep them calm.",
        "Do not leave the person alone.",
        "If they become unresponsive and are not breathing normally, start CPR if trained and use an AED if available."
      ]
    },

    {
      category: "Medical",
      icon: "🧠",
      title: "Stroke",
      signs:
        "Sudden face drooping, arm weakness, speech difficulty, confusion, vision problems, dizziness or loss of balance.",
      steps: [
        "Use FAST: Face, Arms, Speech, Time.",
        "Call 112 immediately if stroke is suspected.",
        "Note the time when symptoms first appeared.",
        "Keep the person safe and comfortable.",
        "Do not give food or drink if swallowing may be affected."
      ]
    },

    {
      category: "Medical",
      icon: "🫁",
      title: "Asthma / Breathing Difficulty",
      signs:
        "Wheezing, coughing, chest tightness, rapid breathing or difficulty speaking because of breathlessness.",
      steps: [
        "Help the person sit upright and stay calm.",
        "Help them use their prescribed reliever inhaler if available.",
        "Move away from smoke or other obvious triggers if safe.",
        "Call 112 if breathing is severe, worsening or the person cannot speak normally.",
        "Monitor breathing until help arrives."
      ]
    },

    {
      category: "Medical",
      icon: "🫀",
      title: "Cardiac Arrest",
      signs:
        "The person is unresponsive and is not breathing normally or is only gasping.",
      steps: [
        "Call 112 immediately and ask someone to get an AED if available.",
        "Place the person on a firm, flat surface.",
        "Start CPR according to your training.",
        "Use an AED as soon as it is available and follow its instructions.",
        "Continue until the person shows signs of life or professional help takes over."
      ]
    },

    {
      category: "Medical",
      icon: "⚠️",
      title: "Seizure",
      signs:
        "Sudden loss of awareness, body stiffening, jerking movements or unusual behaviour.",
      steps: [
        "Protect the person from nearby dangerous objects.",
        "Do not hold the person down.",
        "Do not put anything in their mouth.",
        "After movements stop, check breathing and place them on their side if appropriate.",
        "Call 112 for a prolonged seizure, repeated seizures, injury, breathing problems or a first known seizure."
      ]
    },

    {
      category: "Medical",
      icon: "😵",
      title: "Fainting / Unconsciousness",
      signs:
        "Sudden collapse, weakness, dizziness or loss of responsiveness.",
      steps: [
        "Check responsiveness and breathing.",
        "If unconscious but breathing normally, place the person in the recovery position when appropriate.",
        "Loosen tight clothing and monitor breathing.",
        "If they are not breathing normally, call 112 and start CPR if trained.",
        "Seek medical help if they do not recover quickly or fainting is unexplained."
      ]
    },

    {
      category: "Medical",
      icon: "🤧",
      title: "Severe Allergic Reaction",
      signs:
        "Swelling of lips, tongue or throat, breathing difficulty, wheezing, widespread rash, dizziness or collapse.",
      steps: [
        "Call 112 immediately for a severe reaction.",
        "Help the person use their prescribed adrenaline/epinephrine auto-injector if they have one.",
        "Keep them in a safe position and monitor breathing.",
        "Do not give food or drink if they have difficulty swallowing.",
        "Be prepared to start CPR if they become unresponsive and stop breathing normally."
      ]
    },

    // ================= INJURIES =================

    {
      category: "Injury",
      icon: "🩸",
      title: "Severe Bleeding",
      signs:
        "Heavy, continuous or spurting bleeding, rapidly soaked clothing or signs of shock.",
      steps: [
        "Call 112 for life-threatening bleeding.",
        "Apply firm direct pressure to the wound using clean cloth or gauze.",
        "Maintain continuous pressure.",
        "If blood soaks through, add more material on top instead of repeatedly removing the first layer.",
        "Keep the person warm and monitor them until help arrives."
      ]
    },

    {
      category: "Injury",
      icon: "🔥",
      title: "Burns",
      signs:
        "Painful, red, blistered, white, charred or damaged skin.",
      steps: [
        "Stop the burning process and move away from the source if safe.",
        "Cool the burn under cool running water for about 20 minutes.",
        "Remove jewellery or clothing near the burn unless it is stuck to the skin.",
        "Cover the cooled burn loosely with a clean non-stick covering.",
        "Do not apply ice, butter, toothpaste, oils or creams to a serious burn."
      ]
    },

    {
      category: "Injury",
      icon: "😮",
      title: "Choking",
      signs:
        "Unable to breathe, speak or cough effectively, or showing obvious severe breathing distress.",
      steps: [
        "If the person can cough effectively, encourage them to keep coughing.",
        "If they cannot breathe or speak, call 112 and provide choking first aid according to your training.",
        "Do not blindly put fingers into the person's mouth.",
        "Follow the emergency dispatcher's instructions.",
        "If the person becomes unresponsive and is not breathing normally, begin CPR if trained."
      ]
    },

    {
      category: "Injury",
      icon: "🦴",
      title: "Fracture",
      signs:
        "Severe pain, swelling, bruising, deformity or inability to move the injured area normally.",
      steps: [
        "Keep the injured area as still as possible.",
        "Do not attempt to straighten the bone.",
        "Support the injured area in the position found.",
        "Apply a wrapped cold pack around the area if appropriate.",
        "Seek urgent medical help for severe injury, deformity or suspected spine injury."
      ]
    },

    {
      category: "Injury",
      icon: "🤕",
      title: "Head Injury",
      signs:
        "Headache, confusion, vomiting, dizziness, memory problems, unusual sleepiness or loss of consciousness.",
      steps: [
        "Keep the person still and monitor them closely.",
        "Call 112 for loss of consciousness, repeated vomiting, seizure, severe confusion or worsening symptoms.",
        "Avoid unnecessary movement if a neck or spinal injury is possible.",
        "Control external bleeding gently unless a skull fracture is suspected.",
        "Monitor responsiveness and breathing until help arrives."
      ]
    },

    {
      category: "Injury",
      icon: "🚗",
      title: "Road Accident / Trauma",
      signs:
        "Bleeding, fractures, head injury, unconsciousness, breathing problems or multiple injuries after an accident.",
      steps: [
        "Make sure the scene is safe before approaching.",
        "Call 112 and give the location and number of injured people.",
        "Do not move a seriously injured person unless there is immediate danger.",
        "Control severe external bleeding with direct pressure.",
        "Monitor breathing and responsiveness until emergency services arrive."
      ]
    },

    // ================= BITES =================

    {
      category: "Bites",
      icon: "🐍",
      title: "Snake Bite",
      signs:
        "Bite marks, pain, swelling, weakness, vomiting, drooping eyelids or breathing difficulty.",
      steps: [
        "Move away from the snake and call 112 or seek urgent medical care.",
        "Keep the person calm and as still as possible.",
        "Immobilize the bitten limb and reduce unnecessary movement.",
        "Remove rings, watches or tight items before swelling increases.",
        "Do not cut the wound, suck venom, apply ice or use a tight tourniquet."
      ]
    },

    {
      category: "Bites",
      icon: "🐶",
      title: "Dog / Animal Bite",
      signs:
        "Broken skin, bleeding, pain, scratches or swelling after an animal bite.",
      steps: [
        "Move to a safe place away from the animal.",
        "Wash the wound thoroughly with soap and running water.",
        "Control bleeding with gentle pressure using clean material.",
        "Cover the wound with a clean dressing.",
        "Seek medical care promptly for rabies and tetanus assessment."
      ]
    },

    // ================= OTHER =================

    {
      category: "Other",
      icon: "⚡",
      title: "Electric Shock",
      signs:
        "Burns, muscle injury, unconsciousness, abnormal breathing or collapse after electrical contact.",
      steps: [
        "Do not touch the person while they are still connected to electricity.",
        "Turn off the electrical source if it can be done safely.",
        "Call 112 for a significant electrical injury.",
        "Once the source is disconnected, check responsiveness and breathing.",
        "Start CPR if the person is not breathing normally and you are able to do so."
      ]
    },

    {
      category: "Other",
      icon: "🌊",
      title: "Drowning",
      signs:
        "Breathing difficulty, coughing, blue or pale appearance, confusion or unconsciousness after being in water.",
      steps: [
        "Call 112 immediately.",
        "Do not enter dangerous water unless you can perform a safe rescue.",
        "Once the person is safely out of the water, check responsiveness and breathing.",
        "If they are not breathing normally, begin CPR according to your training.",
        "Keep the person warm and monitor them until help arrives."
      ]
    },

    {
      category: "Other",
      icon: "☠️",
      title: "Poisoning",
      signs:
        "Vomiting, confusion, unusual sleepiness, breathing problems, seizures or unconsciousness after possible poison exposure.",
      steps: [
        "Call 112 or obtain urgent medical advice.",
        "Try to identify the substance, container or medicine involved.",
        "Do not deliberately make the person vomit.",
        "Do not give food or drink unless instructed by a medical professional.",
        "Monitor breathing and responsiveness while waiting for help."
      ]
    },

    {
      category: "Other",
      icon: "🌡️",
      title: "Heat Stroke / Heat Exhaustion",
      signs:
        "Heavy sweating, weakness, dizziness and nausea may occur with heat exhaustion; confusion, collapse, seizure or very high body temperature can indicate heat stroke.",
      steps: [
        "Move the person to a cool or shaded area.",
        "Remove unnecessary outer clothing.",
        "Cool the person using cool water, wet cloths or other safe cooling methods.",
        "For heat exhaustion, give cool fluids if the person is fully awake and able to drink.",
        "Heat stroke is an emergency: call 112 and continue rapid cooling while waiting for help."
      ]
    },

    {
      category: "Other",
      icon: "🧊",
      title: "Hypothermia",
      signs:
        "Shivering, cold skin, confusion, slurred speech, drowsiness, poor coordination or loss of consciousness.",
      steps: [
        "Move the person to a warm, dry place if possible.",
        "Remove wet clothing carefully and replace it with dry layers.",
        "Wrap the person in blankets, including the head and neck while keeping the face clear.",
        "Handle a severely cold person gently and seek medical help.",
        "If unresponsive and not breathing normally, call 112 and start CPR if trained."
      ]
    }
  ];

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredGuides = guides.filter((guide) => {
    const searchText = search
      .trim()
      .toLowerCase();

    return (
      guide.title
        .toLowerCase()
        .includes(searchText) ||
      guide.category
        .toLowerCase()
        .includes(searchText) ||
      guide.signs
        .toLowerCase()
        .includes(searchText)
    );
  });

  // ==========================================
  // CALL 112
  // ==========================================

  const call112 = () => {
    window.location.href = "tel:112";
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="guide-page">

      <div className="guide-glow guide-glow-blue" />
      <div className="guide-glow guide-glow-red" />

      <div className="guide-container">

        {/* ================= HERO ================= */}

        <section className="guide-hero">

          <div className="guide-hero-content">

            <div className="guide-eyebrow">
              <span />
              EMERGENCY KNOWLEDGE CENTER
            </div>

            <div className="guide-title-row">

              <div className="guide-title-icon">
                <FaFirstAid />
              </div>

              <div>

                <h1>
                  First Aid Emergency Guide
                </h1>

                <p>
                  Quick step-by-step first-aid
                  guidance for common medical
                  emergencies, injuries and
                  critical situations.
                </p>

              </div>

            </div>

            <div className="guide-hero-status">

              <div>
                <FaShieldAlt />

                <span>
                  {guides.length} Emergency Guides
                </span>
              </div>

              <div>
                <FaHeartbeat />

                <span>
                  No API Required
                </span>
              </div>

            </div>

          </div>

          {/* CALL 112 PANEL */}

          <div className="guide-emergency-action">

            <span>
              IMMEDIATE EMERGENCY
            </span>

            <strong>
              Need urgent help?
            </strong>

            <p>
              Contact official emergency
              services immediately for a serious
              or life-threatening emergency.
            </p>

            <button
              type="button"
              onClick={call112}
            >
              <FaPhoneAlt />
              CALL 112
            </button>

          </div>

        </section>

        {/* ================= WARNING ================= */}

        <section className="guide-warning">

          <div className="guide-warning-icon">
            <FaExclamationTriangle />
          </div>

          <div>

            <span>
              IMPORTANT SAFETY NOTICE
            </span>

            <p>
              This guide provides basic
              first-aid information only. It
              does not replace professional
              medical care. For a serious or
              life-threatening emergency, call
              112 immediately.
            </p>

          </div>

        </section>

        {/* ================= SEARCH ================= */}

        <section className="guide-search-section">

          <div className="guide-search-heading">

            <div>

              <span>
                FIND EMERGENCY GUIDANCE
              </span>

              <h2>
                What emergency are you facing?
              </h2>

              <p>
                Search by emergency name,
                category or common signs.
              </p>

            </div>

            <div className="guide-result-count">

              <strong>
                {filteredGuides.length}
              </strong>

              <span>
                OF {guides.length} GUIDES
              </span>

            </div>

          </div>

          <div className="guide-search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search: stroke, snake bite, burn, accident..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="guide-clear-search"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}

          </div>

        </section>

        {/* ================= GUIDE CARDS ================= */}

        {filteredGuides.length > 0 ? (

          <section className="guide-grid">

            {filteredGuides.map(
              (guide, index) => (

                <article
                  className="emergency-guide-card"
                  key={guide.title}
                >

                  {/* CARD HEADER */}

                  <div className="emergency-card-header">

                    <div className="emergency-guide-icon">
                      {guide.icon}
                    </div>

                    <div className="emergency-card-heading">

                      <span className="emergency-category">
                        {guide.category}
                      </span>

                      <h2>
                        {guide.title}
                      </h2>

                    </div>

                    <span className="guide-number">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                  </div>

                  {/* COMMON SIGNS */}

                  <div className="emergency-signs">

                    <div className="emergency-section-title signs-title">

                      <FaExclamationTriangle />

                      <span>
                        COMMON SIGNS
                      </span>

                    </div>

                    <p>
                      {guide.signs}
                    </p>

                  </div>

                  {/* IMMEDIATE STEPS */}

                  <div className="emergency-steps">

                    <div className="emergency-section-title steps-title">

                      <FaFirstAid />

                      <span>
                        IMMEDIATE STEPS
                      </span>

                    </div>

                    <ol>

                      {guide.steps.map(
                        (
                          step,
                          stepIndex
                        ) => (

                          <li
                            key={
                              stepIndex
                            }
                          >

                            <span className="step-number">
                              {stepIndex +
                                1}
                            </span>

                            <p>
                              {step}
                            </p>

                          </li>

                        )
                      )}

                    </ol>

                  </div>

                  {/* CARD FOOTER */}

                  <div className="emergency-card-footer">

                    <div>
                      <FaShieldAlt />

                      FIRST-AID REFERENCE
                    </div>

                    <button
                      type="button"
                      onClick={call112}
                    >
                      <FaPhoneAlt />
                      112
                    </button>

                  </div>

                </article>

              )
            )}

          </section>

        ) : (

          /* ================= NO RESULTS ================= */

          <section className="guide-no-results">

            <div className="guide-no-result-icon">
              <FaSearch />
            </div>

            <span>
              NO MATCHING GUIDE
            </span>

            <h2>
              Emergency guide not found
            </h2>

            <p>
              Try another search term. If the
              situation is urgent or
              life-threatening, contact
              emergency services immediately.
            </p>

            <div className="guide-no-result-actions">

              <button
                type="button"
                className="guide-reset-button"
                onClick={() =>
                  setSearch("")
                }
              >
                Clear Search
              </button>

              <button
                type="button"
                className="guide-call-button"
                onClick={call112}
              >
                <FaPhoneAlt />
                CALL 112
              </button>

            </div>

          </section>

        )}

        {/* ================= EMERGENCY FOOTER ================= */}

        <section className="guide-emergency-footer">

          <div className="guide-footer-icon">
            <FaHeartbeat />
          </div>

          <div className="guide-footer-content">

            <span>
              LIFE-THREATENING EMERGENCY
            </span>

            <h2>
              Don't rely only on this guide.
            </h2>

            <p>
              Contact official emergency
              services immediately when urgent
              professional assistance is
              required.
            </p>

          </div>

          <button
            type="button"
            onClick={call112}
          >
            <FaPhoneAlt />
            Call 112 Now
          </button>

        </section>

      </div>

    </main>
  );
}

export default EmergencyGuide;