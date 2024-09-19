import { FaEdit, FaLightbulb, FaPalette, FaExclamationTriangle, FaUser, FaCommentDots, FaQuestionCircle } from 'react-icons/fa'

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
    // Map categories to icons
    const categoryIcons = {
      're-write with the new proposed text': <FaEdit className="text-blue-600 inline-block mr-2" />,
      'can be improved with suggestion': <FaLightbulb className="text-yellow-500 inline-block mr-2" />,
      'wrong-theme': <FaPalette className="text-red-500 inline-block mr-2" />,
      'too cliché': <FaExclamationTriangle className="text-orange-500 inline-block mr-2" />,
      'personal-opinion': <FaUser className="text-green-500 inline-block mr-2" />,
      'informal-language': <FaCommentDots className="text-purple-500 inline-block mr-2" />,
      'uncertain-language': <FaQuestionCircle className="text-gray-500 inline-block mr-2" />,
    }

    const categoryNames= {
      're-write with the new proposed text': "Should re-write",
      'can be improved with suggestion': "Could be improved",
      'wrong-theme': "Wrong theme",
      'too cliché': "Too cliché",
      'personal-opinion': "Personal opinion",
      'informal-language': "Informal language",
      'uncertain-language': "Uncertain language",   
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
          <strong className="text-blue-600">{categoryNames[item.category]}:</strong>
        </div>
        <p className="text-gray-800">{item.suggestion}</p>
        {item.originalText && (
          <em className="text-gray-500 block mt-1">"{item.originalText}"</em>
        )}
      </div>
    )
  }
  