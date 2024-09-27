import { useState, useContext } from 'react';
import { titleAffectingCategories, generalFeedbackCategories } from "../lib/editor-helpers"
import { EditorContext } from "@/app/components/EditorContext"

import { FaEdit, FaLightbulb, FaPalette, 
        FaExclamationTriangle, FaUser, FaCommentDots, 
        FaQuestionCircle, FaBriefcase, FaBullhorn,
        FaSitemap, FaMeh, FaEye, FaSyncAlt,
        FaFileAlt, FaUserSecret, FaPauseCircle,
      FaExclamationCircle, FaBug, FaThumbsDown, FaFont, FaSortAmountDown,
    FaHeading } from 'react-icons/fa'


function highlightFeedback(idx, action="highlight") {
    if(action == "highlight") {
        document.getElementById("suggestion_" + idx)?.classList.add("suggested-highlight");
        document.getElementById(`highlight_${idx}`)?.classList.add("suggested-highlight");
    } else {
        document.getElementById("suggestion_" + idx)?.classList.remove("suggested-highlight");
        document.getElementById(`highlight_${idx}`)?.classList.remove("suggested-highlight");

    }
  }   

  function scrollToText(idx) {  
    document.getElementById("highlight_" + idx)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

   



  export function FeedbackCard({ item, index }) {
    const {title, setTitle} = useContext(EditorContext)

      const [applied, setApplied] = useState(false)
      const [ignored, setIgnored] = useState(false)

    function applySuggestion(idx, suggestion, category) {
      if(titleAffectingCategories.includes(category)) {
        setTitle(suggestion)
        setApplied(true)
        return false
      }
      const suggestionElement = document.getElementById("highlight_" + idx)
      if(suggestionElement) {
        suggestionElement.innerHTML = `${suggestion}` 
        suggestionElement.classList.remove("suggested-highlight")
        suggestionElement.classList.add("suggestion-applied")
        setApplied(true)
      }
      return false
    }

    function ignoreSuggestion(idx) {
      setIgnored(true)
    }


    // Map categories to icons
    const categoryIcons = {
      're-write with the new proposed text': <FaEdit className="text-blue-600 inline-block mr-2" />,
      'can be improved with suggestion': <FaLightbulb className="text-yellow-500 inline-block mr-2" />,
      'wrong-theme': <FaPalette className="text-red-500 inline-block mr-2" />,
      'old-fashioned': <FaExclamationTriangle className="text-orange-500 inline-block mr-2" />,
      'personal-opinion': <FaUser className="text-green-500 inline-block mr-2" />,
      'informal-language': <FaCommentDots className="text-purple-500 inline-block mr-2" />,
      'uncertain-language': <FaQuestionCircle className="text-gray-500 inline-block mr-2" />,
      'too-formal': <FaBriefcase className="text-indigo-500 inline-block mr-2" />,
      'too-marketing-oriented': <FaBullhorn className="text-pink-500 inline-block mr-2" />,
      'incorrect-structure':  <FaSitemap className="text-teal-500 inline-block mr-2" />,
      "show-dont-tell": <FaEye className="text-blue-500 inline-block mr-2" />,
      "flat-character": <FaMeh className="text-gray-600 inline-block mr-2" />,
      "obvious-plot-twist": <FaSyncAlt className="text-orange-600 inline-block mr-2" />,
      'poor-intro': <FaFileAlt className="text-red-500 inline-block mr-2" />,
      'misleading-intro':  <FaUserSecret className="text-yellow-600 inline-block mr-2" />,
      'missing-cta': <FaBullhorn className="text-green-500 inline-block mr-2" />, 
      'passive-voice': <FaPauseCircle className="text-blue-700 inline-block mr-2" />,
      'technically-incorrect': <FaExclamationCircle className="text-red-600 inline-block mr-2" />,
      'potential-code-bug': <FaBug className="text-red-500 inline-block mr-2" />,
      'promise-unfulfilled': <FaThumbsDown className="text-purple-500 inline-block mr-2" />,
      'title-too-bland': <FaFont className="text-gray-500 inline-block mr-2" />,
      'title-too-short': <FaSortAmountDown className="text-green-500 inline-block mr-2" />,
      'poor-title': <FaHeading className="text-red-500 inline-block mr-2" />,
    }

    const categoryNames= {
      're-write with the new proposed text': "Should re-write",
      'can be improved with suggestion': "Could be improved",
      'wrong-theme': "Wrong theme",
      'old-fashioned': "No longer used",
      'personal-opinion': "Personal opinion",
      'informal-language': "Informal language",
      'uncertain-language': "Uncertain language",   
      'too-marketing-oriented': "Too Marketing-oriented",   
      'too-formal': "Too Formal",
      'incorrect-structure': "Incorrect Structure",
      "show-dont-tell": "Show don't tell",
      "flat-character": "Flat character",
      "obvious-plot-twist": "Too obvious",
      'poor-intro': "Poor intro",
      'misleading-intro': "Misleading intro",
      'missing-cta': "Could use a CTA", //changed because it tends to look for CTAs in multiple places
      'passive-voice': "Passive voice",
      'explanation-too-technical': "The explanation is too technical",
      "technically-incorrect": "Technically incorrect",
      "potential-code-bug": "Potential bug in code",
      "promise-unfulfilled": "Promise not fulfilled",
      "title-too-bland": "Title too bland",
      "title-too-short": "Title too short",
      "poor-title": "Poor title",
  
    }

    if(item.error) {    
      return (
        <div
          key={index}
          className="p-2 border-b cursor-pointer"
          id={`suggestion_${index}`}
        >
          <div className="flex items-center mb-1">
            <FaExclamationTriangle className="text-red-500 inline-block mr-2" />
            <strong className="text-red-600">Error:</strong>
          </div>
          <p className="text-red-800">{item.error}</p>
          {item.originalText && (
            <em className="text-gray-500 block mt-1">"{item.originalText}"</em>
          )}
        </div>
      )
    }
  
    return (
      <div
        key={index}
        className="p-2 border-b cursor-pointer"
        id={`suggestion_${index}`}
        onMouseOver={() => highlightFeedback(index)}
        onMouseOut={() => highlightFeedback(index, 'hide')}
        onClick={() => scrollToText(index)}
      >
        <div className="flex items-center mb-1">
          {categoryIcons[item.category] || <FaExclamationTriangle className="text-gray-500 inline-block mr-2" />}
          <strong className="text-blue-600">{categoryNames[item.category] || item.category}:</strong>
        </div>
        {item.originalText && (
          <em className="text-gray-500 text-xs text-left block mt-1">"{item.originalText}"</em>
        )}
        {item.explanation && (
          <span className="text-gray-500 text-left block mt-1">{item.explanation}</span>
        )}


        <p className="text-gray-800 font-medium text-left">Replace with:</p> <p className="text-gray-800 text-left">{item.suggestion}</p>
        <div className="flex items-center mt-2">
          {(!applied && !ignored && !generalFeedbackCategories.includes(item.category)) && (
            <>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 mr-2" onClick={() => applySuggestion(index, item.suggestion, item.category)}>Apply</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300" onClick={() => ignoreSuggestion(index)}>Ignore</button>
        </>
          )}
      </div>
      </div>
    )
  }
  