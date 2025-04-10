import React, { useState } from "react";

// Update the component definition to accept props
const FeaturesSection = ({ announcementsCount }) => {
  const [activeSection, setActiveSection] = useState(null);

  const cardStyle = {
    background: 'linear-gradient(71deg, #080509, #1a171c, #080509)',
    position: 'relative',
    border: '2px solid transparent',
    backgroundClip: 'padding-box',
    borderRadius: '45px',
    transition: 'all 0.3s ease-in-out',
    width: '100%', // Changed from fixed width
    height: 'auto', // Changed from fixed height
    minHeight: '280px', // Added minimum height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const buttonStyle = {
    // background: 'linear-gradient(71deg, #3da077, #54E8A9, #3da077)',
    background: 'rgba(25, 25, 25)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '400',
    transition: 'all 0.3s ease',
  };

  // Update the cardData array, find the Announcements object and modify its description:
  const cardData = [
    {
      gradient: 'linear-gradient(71deg, #0d1212, #3da077, #0d1212)',
      title: 'Announcements',
      svg: (
        <svg
          width="80"
          height="80"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="118"
            height="118"
            rx="24"
            fill="url(#paint0_linear_1366_4547)"
            fillOpacity="0.15"
            stroke="url(#paint1_radial_1366_4547)"
            strokeWidth="2"
          ></rect>
          <text
            x="60"
            y="70"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="70"
            fontWeight="bold"
            fill="#54E8A9"
          >
            {announcementsCount || 0}
          </text>
          <defs>
            <linearGradient
              id="paint0_linear_1366_4547"
              x1="0.0063367"
              y1="0.168432"
              x2="120.853"
              y2="119.009"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2FCB89" stopOpacity="0.7"></stop>
              <stop offset="0.489583" stopColor="#2FCB89" stopOpacity="0"></stop>
              <stop offset="1" stopColor="#2FCB89" stopOpacity="0.7"></stop>
            </linearGradient>
            <radialGradient
              id="paint1_radial_1366_4547"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(60 60) rotate(96.8574) scale(122.674 149.921)"
            >
              <stop stopColor="#54E8A9"></stop>
              <stop offset="1" stopColor="#1A3E31" stopOpacity="0.2"></stop>
            </radialGradient>
          </defs>
        </svg>
      ),
      description: ` Stay updated with the latest announcements from mentors and administrators about important updates and events.`
    },
    {
      gradient: 'linear-gradient(71deg, #121013, #b0afb0, #121013)',
      title: 'Class Briefings',
      svg: (
        <svg
          width="80"
          height="80"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="118"
            height="118"
            rx="24"
            fill="url(#paint0_linear_1366_4565)"
            fillOpacity="0.15"
            stroke="url(#paint1_radial_1366_4565)"
            strokeWidth="2"
          ></rect>
          <ellipse
            rx="21.9462"
            ry="22.2891"
            transform="matrix(0.964749 0.263173 -0.254526 0.967066 60.1463 63.0804)"
            stroke="white"
            strokeWidth="1.00101"
            strokeLinecap="round"
            strokeDasharray="4 5.01"
          ></ellipse>
          <ellipse
            rx="17.4359"
            ry="17.5832"
            transform="matrix(-1 0 0 1 60.1466 39.5834)"
            fill="white"
          ></ellipse>
          <path
            d="M63.5924 38.93C64.4717 38.4692 65.0312 37.6495 64.9014 36.2874C64.7314 34.4228 63.2378 33.7982 61.2597 33.624V31.0427H59.721V33.5522C59.3212 33.5522 58.9118 33.5626 58.5019 33.5725V31.0427H56.9631V33.624C56.3974 33.6416 55.7384 33.6328 53.876 33.624V35.3039C55.0905 35.282 55.7283 35.2019 55.8744 36.0003V43.0678C55.7815 43.7013 55.2869 43.6103 54.186 43.5905L53.8765 45.4649C56.682 45.4649 56.9641 45.4754 56.9641 45.4754V47.6858H58.5029V45.506C58.9224 45.5164 59.3319 45.5164 59.722 45.5164V47.6863H61.2607V45.4759C63.8385 45.3323 65.5619 44.6666 65.7917 42.1774C65.9713 40.1803 65.0526 39.2888 63.5935 38.9305L63.5924 38.93ZM58.5318 35.4167C59.4008 35.4167 62.1186 35.14 62.1186 36.9942C62.1186 38.7661 59.4008 38.5612 58.5318 38.5612V35.4167ZM58.5318 43.6004V40.1381C59.5708 40.1381 62.7528 39.8412 62.7528 41.869C62.7528 43.8256 59.5708 43.5999 58.5318 43.5999V43.6004Z"
            fill="#2E3042"
          ></path>
          <path
            d="M82.5643 62.834C92.1944 62.834 100 70.7058 100 80.4172C100 90.1286 92.1944 98.0004 82.5643 98.0004C72.9342 98.0004 65.1284 90.1286 65.1284 80.4172C65.1284 70.7058 72.9342 62.834 82.5643 62.834ZM92.0516 84.2822H76.3964C76.2271 84.282 76.0646 84.3491 75.9441 84.469L72.8514 87.5626C72.8065 87.6073 72.7759 87.6645 72.7634 87.7269C72.751 87.7893 72.7573 87.854 72.7815 87.9128C72.8057 87.9716 72.8468 88.0217 72.8994 88.0568C72.9521 88.0919 73.0139 88.1104 73.077 88.1098H88.7323C88.9015 88.11 89.064 88.0429 89.1845 87.923L92.2772 84.8284C92.3217 84.7836 92.352 84.7264 92.3643 84.6642C92.3765 84.602 92.3701 84.5376 92.346 84.479C92.3218 84.4205 92.2809 84.3705 92.2285 84.3355C92.1761 84.3004 92.1145 84.2819 92.0516 84.2822ZM88.7323 78.4665H73.077L73.0029 78.4742C72.9476 78.487 72.8968 78.5146 72.8556 78.5539C72.8145 78.5933 72.7846 78.6431 72.769 78.6981C72.7534 78.7531 72.7527 78.8113 72.767 78.8666C72.7813 78.9219 72.8101 78.9724 72.8503 79.0127L75.9452 82.1074L76.0215 82.1733C76.1305 82.2502 76.2612 82.2942 76.3964 82.2942H92.0516L92.1257 82.2865C92.181 82.2737 92.2319 82.2462 92.273 82.2068C92.3141 82.1674 92.3441 82.1177 92.3596 82.0627C92.3752 82.0077 92.3759 81.9495 92.3616 81.8941C92.3473 81.8388 92.3185 81.7883 92.2783 81.748L89.1834 78.6534L89.1071 78.5874C88.9978 78.5086 88.8667 78.4663 88.7323 78.4665Z"
            fill="white"
          ></path>
          <path
            d="M92.0507 84.5023H76.3954C76.2262 84.5022 76.0637 84.57 75.9432 84.6911L72.8505 87.8164C72.8056 87.8616 72.775 87.9194 72.7625 87.9825C72.75 88.0455 72.7563 88.1109 72.7806 88.1703C72.8048 88.2296 72.8458 88.2803 72.8985 88.3158C72.9511 88.3512 73.013 88.3699 73.0761 88.3693H88.7313C88.9006 88.3695 89.0631 88.3017 89.1836 88.1806L92.2763 85.0541C92.3208 85.0089 92.3511 84.9512 92.3633 84.8883C92.3756 84.8255 92.3692 84.7604 92.345 84.7012C92.3208 84.6421 92.2799 84.5916 92.2275 84.5562C92.1751 84.5208 92.1136 84.502 92.0507 84.5023ZM88.7313 78.627H73.0761L73.002 78.6347C72.9467 78.6477 72.8958 78.6755 72.8547 78.7152C72.8136 78.755 72.7836 78.8053 72.7681 78.8608C72.7525 78.9164 72.7518 78.9752 72.7661 79.0311C72.7804 79.087 72.8092 79.138 72.8494 79.1787L75.9443 82.3052L76.0206 82.3718C76.1295 82.4495 76.2603 82.4939 76.3954 82.4939H92.0507L92.1248 82.4861C92.181 82.4732 92.2309 82.4454 92.2721 82.4056C92.3132 82.3659 92.3431 82.3156 92.3587 82.26C92.3743 82.2045 92.375 82.1457 92.3606 82.0898C92.3463 82.0338 92.3176 81.9829 92.2773 81.9421L89.1825 78.8157L89.1062 78.7491C88.9968 78.6694 88.8657 78.6267 88.7323 78.627ZM92.0507 72.8259H76.3954C76.2262 72.8258 76.0637 72.8936 75.9432 73.0147L72.8505 76.1411C72.806 76.1864 72.7757 76.2441 72.7634 76.3069C72.7512 76.3698 72.7576 76.4349 72.7817 76.4941C72.8059 76.5532 72.8468 76.6037 72.8992 76.6391C72.9516 76.6745 73.0132 76.6932 73.0761 76.6929H88.7313C88.9006 76.6931 89.0631 76.6253 89.1836 76.5042L92.2763 73.3788C92.3212 73.3336 92.3518 73.2758 92.3643 73.2128C92.3767 73.1498 92.3704 73.0844 92.3462 73.025C92.322 72.9656 92.2809 72.915 92.2283 72.8795C92.1756 72.844 92.1138 72.8254 92.0507 72.8259Z"
            fill="#2E3042"
          ></path>
          <ellipse
            cx="37.4359"
            cy="78.7687"
            rx="17.4359"
            ry="17.5832"
            fill="white"
          ></ellipse>
          <path
            d="M43.9081 78.9791L37.4362 82.8079L30.96 78.9791L37.4362 68.2188L43.9081 78.9791ZM37.4362 84.0374L30.96 80.2086L37.4362 89.3434L43.9124 80.2086L37.4362 84.0374Z"
            fill="#2E3042"
          ></path>
          <defs>
            <linearGradient
              id="paint0_linear_1366_4565"
              x1="0"
              y1="0"
              x2="120"
              y2="120"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.7"></stop>
              <stop offset="0.505208" stopColor="white" stopOpacity="0"></stop>
              <stop offset="1" stopColor="white" stopOpacity="0.7"></stop>
            </linearGradient>
            <radialGradient
              id="paint1_radial_1366_4565"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(60 60) rotate(96.8574) scale(122.674 149.921)"
            >
              <stop stopColor="white"></stop>
              <stop offset="1" stopColor="#363437" stopOpacity="0.2"></stop>
            </radialGradient>
          </defs>
        </svg>
      ),
      description: 'Access comprehensive summaries of class content, including key topics covered and important discussion points.'
    },
    {
      gradient: 'linear-gradient(71deg, #110e0e, #afa220, #110e0e)',
      title: 'Homework & Classwork',
      svg: (
        <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="118" height="118" rx="24" fill="url(#paint0_linear_1366_4557)" fillOpacity="0.15" stroke="url(#paint1_radial_1366_4557)" strokeWidth="2"></rect>
          <path d="M74.2105 36C73.373 36 72.5698 35.6839 71.9776 35.1213C71.3853 34.5587 71.0526 33.7956 71.0526 33C71.0526 32.2044 71.3853 31.4413 71.9776 30.8787C72.5698 30.3161 73.373 30 74.2105 30H86.8421C87.6796 30 88.4829 30.3161 89.0751 30.8787C89.6673 31.4413 90 32.2044 90 33V45C90 45.7956 89.6673 46.5587 89.0751 47.1213C88.4829 47.6839 87.6796 48 86.8421 48C86.0046 48 85.2014 47.6839 84.6091 47.1213C84.0169 46.5587 83.6842 45.7956 83.6842 45V40.242L65.3905 57.621C64.7983 58.1834 63.9953 58.4994 63.1579 58.4994C62.3205 58.4994 61.5175 58.1834 60.9253 57.621L52.1053 49.242L35.3905 65.121C34.7949 65.6675 33.9972 65.9699 33.1693 65.963C32.3413 65.9562 31.5492 65.6407 30.9637 65.0845C30.3782 64.5282 30.0461 63.7758 30.0389 62.9892C30.0317 62.2026 30.35 61.4448 30.9253 60.879L49.8726 42.879C50.4648 42.3166 51.2679 42.0006 52.1053 42.0006C52.9426 42.0006 53.7457 42.3166 54.3379 42.879L63.1579 51.258L79.219 36H74.2105Z" fill="#FFEE24"></path>
          <defs>
            <linearGradient id="paint0_linear_1366_4557" x1="-0.0208152" y1="-0.102528" x2="119.899" y2="119.817" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE34B" stopOpacity="0.7"></stop>
              <stop offset="0.510417" stopColor="#FFE34B" stopOpacity="0"></stop>
              <stop offset="1" stopColor="#FFE34B" stopOpacity="0.7"></stop>
            </linearGradient>
            <radialGradient id="paint1_radial_1366_4557" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 60) rotate(96.8574) scale(122.674 149.921)">
              <stop stopColor="#FFEE24"></stop>
              <stop offset="1" stopColor="#302A1A" stopOpacity="0.2"></stop>
            </radialGradient>
          </defs>
        </svg>
      ),
      description: 'Track your assignments, due dates, and access class materials to stay on top of your coursework.'
    },
    {
      gradient: 'linear-gradient(71deg, #0c0a0e, #5f6fad, #0c0a0e)',
      title: 'Mentor Messages',
      svg: (
        <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="118" height="118" rx="24" fill="url(#paint0_linear_1366_4582)" fillOpacity="0.15" stroke="url(#paint1_radial_1366_4582)" strokeWidth="2"></rect>
          <path d="M90.9405 64.775L88.0155 69.55L85.1155 64.775H80.0655L85.5155 72.85L79.5905 82H84.4905L88.0155 76.175L91.5155 82H96.4405L90.4905 72.85L95.9405 64.775H90.9405Z" fill="#87A1FF"></path>
          <path d="M44.9833 35.52L27.3433 43.92V52.53L35.1833 49.17V82H44.9833V35.52ZM71.37 35.52L53.73 43.92V52.53L61.57 49.17V82H71.37V35.52Z" fill="#87A1FF"></path>
          <defs>
            <linearGradient id="paint0_linear_1366_4582" x1="120.194" y1="119.827" x2="-13.1225" y2="17.1841" gradientUnits="userSpaceOnUse">
              <stop stopColor="#61A0FF" stopOpacity="0.7"></stop>
              <stop offset="0.489583" stopColor="#61A0FF" stopOpacity="0"></stop>
              <stop offset="1" stopColor="#61A0FF" stopOpacity="0.7"></stop>
            </linearGradient>
            <radialGradient id="paint1_radial_1366_4582" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 60) rotate(96.8574) scale(122.674 149.921)">
              <stop stopColor="#87A1FF"></stop>
              <stop offset="1" stopColor="#16161D" stopOpacity="0.2"></stop>
            </radialGradient>
          </defs>
        </svg>
      ),
      description: 'Direct communication channel with mentors for guidance, feedback, and support throughout your learning journey.'
    }
  ];

  const handleCardClick = (title) => {
    const sectionMap = {
      'Announcements': 'announcement-section',
      'Class Briefings': 'briefing-section',
      'Homework & Classwork': 'assignment-section',
      'Mentor Messages': 'messages-section'
    };

    // Hide all sections first
    Object.values(sectionMap).forEach(section => {
      const element = document.querySelector(`.${section}`);
      if (element) {
        element.style.display = 'none';
      }
    });

    // Show selected section
    const sectionToShow = sectionMap[title];
    if (sectionToShow) {
      const element = document.querySelector(`.${sectionToShow}`);
      if (element) {
        element.style.display = activeSection === title ? 'none' : 'block';

        // Add smooth scrolling when showing section
        if (activeSection !== title) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }, 100); // Small delay to ensure section is visible first
        }
      }
    }

    // Toggle active section
    setActiveSection(activeSection === title ? null : title);
  };

  return (
    <div className="py-8 sm:py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mx-auto max-w-7xl"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3da077 transparent',
          }}
        >
          <style>
            {`
              .card {
                transition: all 0.3s ease-in-out;
                margin: 4px;
              }
              .card:hover {
                transform: translateY(-10px);
                box-shadow: 0 20px 40px rgba(61, 160, 119, 0.2);
              }
              .hover-button:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 15px rgba(61, 160, 119, 0.4);
              }
              .description {
                color: #808080;
                transition: color 0.3s ease-in;
              }
              .card:hover .description {
                color: #000000;
                transition: color 1.2s ease-out;
              }
              @media (max-width: 640px) {
                .card {
                  margin: 8px 0;
                }
              }
            `}
          </style>

          {cardData.map((card, index) => (
            <div
              key={index}
              className="w-full"
            >
              <div
                style={cardStyle}
                className="card p-6 sm:p-8 lg:p-6"
              >
                <div style={{
                  background: card.gradient,
                  position: 'absolute',
                  inset: '-2px',
                  borderRadius: '45px',
                  zIndex: -1,
                }}></div>
                <div className="flex flex-col h-full justify-between gap-4 ">
                  <div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20">
                        {card.svg}
                      </div>
                      <h3 className="text-white text-lg sm:text-xl font-semibold text-center sm:text-left">{card.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm font-semibold mt-4 text-center sm:text-left description">{card.description}</p>
                  </div>
                  <button
                    style={buttonStyle}
                    className="hover-button w-full sm:w-auto"
                    onClick={() => handleCardClick(card.title)}
                  >
                    {activeSection === card.title ? 'Hide Section' : 'Show Section'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Update the prop types
FeaturesSection.defaultProps = {
  announcementsCount: 0
};

export default FeaturesSection;