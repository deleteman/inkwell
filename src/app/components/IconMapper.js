// IconMapper.js
import React from 'react';
import {
  FaEdit, FaLightbulb, FaPalette, FaExclamationTriangle, FaUser,
  FaCommentDots, FaQuestionCircle, FaBriefcase, FaBullhorn, FaSitemap,
  FaMeh, FaEye, FaSyncAlt, FaFileAlt, FaUserSecret, FaPauseCircle,
  FaExclamationCircle, FaBug, FaThumbsDown, FaFont, FaSortAmountDown,
  FaHeading
} from 'react-icons/fa';

const categoryIcons = {
  're-write with the new proposed text': <FaEdit className="text-blue-600 inline-block mr-2" />,
  'can be improved with suggestion': <FaLightbulb className="text-yellow-500 inline-block mr-2" />,
  'wrong-theme': <FaPalette className="text-red-500 inline-block mr-2" />,
  'too-cliche': <FaExclamationTriangle className="text-orange-500 inline-block mr-2" />,
  'personal-opinion': <FaUser className="text-green-500 inline-block mr-2" />,
  'informal-language': <FaCommentDots className="text-purple-500 inline-block mr-2" />,
  'uncertain-language': <FaQuestionCircle className="text-gray-500 inline-block mr-2" />,
  'too-formal': <FaBriefcase className="text-indigo-500 inline-block mr-2" />,
  'too-marketing-oriented': <FaBullhorn className="text-pink-500 inline-block mr-2" />,
  'incorrect-structure': <FaSitemap className="text-teal-500 inline-block mr-2" />,
  "show-dont-tell": <FaEye className="text-blue-500 inline-block mr-2" />,
  "flat-character": <FaMeh className="text-gray-600 inline-block mr-2" />,
  "obvious-plot-twist": <FaSyncAlt className="text-orange-600 inline-block mr-2" />,
  'poor-intro': <FaFileAlt className="text-red-500 inline-block mr-2" />,
  'misleading-intro': <FaUserSecret className="text-yellow-600 inline-block mr-2" />,
  'missing-cta': <FaBullhorn className="text-green-500 inline-block mr-2" />,
  'passive-voice': <FaPauseCircle className="text-blue-700 inline-block mr-2" />,
  'technically-incorrect': <FaExclamationCircle className="text-red-600 inline-block mr-2" />,
  'potential-code-bug': <FaBug className="text-red-500 inline-block mr-2" />,
  'promise-unfulfilled': <FaThumbsDown className="text-purple-500 inline-block mr-2" />,
  'title-too-bland': <FaFont className="text-gray-500 inline-block mr-2" />,
  'title-too-short': <FaSortAmountDown className="text-green-500 inline-block mr-2" />,
  'poor-title': <FaHeading className="text-red-500 inline-block mr-2" />,
};

const categoryNames = {
  're-write with the new proposed text': "Should Re-write",
  'can be improved with suggestion': "Could Be Improved",
  'wrong-theme': "Wrong Theme",
  'too-cliche': "Too Cliché",
  'personal-opinion': "Personal Opinion",
  'informal-language': "Informal Language",
  'uncertain-language': "Uncertain Language",   
  'too-marketing-oriented': "Too Marketing-Oriented",   
  'too-formal': "Too Formal",
  'incorrect-structure': "Incorrect Structure",
  "show-dont-tell": "Show Don't Tell",
  "flat-character": "Flat Character",
  "obvious-plot-twist": "Too Obvious",
  'poor-intro': "Poor Intro",
  'misleading-intro': "Misleading Intro",
  'missing-cta': "Could Use a CTA",
  'passive-voice': "Passive Voice",
  'technically-incorrect': "Technically Incorrect",
  'potential-code-bug': "Potential Bug in Code",
  'promise-unfulfilled': "Promise Not Fulfilled",
  'title-too-bland': "Title Too Bland",
  'title-too-short': "Title Too Short",
  'poor-title': "Poor Title",
};

const IconMapper = ({ category }) => {
  return (
    <>
      {categoryIcons[category] || <FaExclamationTriangle className="text-gray-500 inline-block mr-2" />}
      <strong className="text-blue-600">{categoryNames[category] || category}:</strong>
    </>
  );
};

export default React.memo(IconMapper);
