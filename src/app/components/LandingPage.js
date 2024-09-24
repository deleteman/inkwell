'use client'
import { useState, useEffect } from 'react';
import { FaGoogle, FaCheckCircle, FaQuoteLeft } from 'react-icons/fa';
import { Editor } from './Editor';
import { EditorComponent } from './EditorComponent';
import { ProAd } from './ProAd';

export default function LandingPage({ signIn }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [reviewAttempted, setReviewAttempted] = useState(false);
  const [stateLoaded, setStateLoaded] = useState(false);

  useEffect(() => {
    console.log("Loading the value of reviewAttempted")
    const storedValue = localStorage ? localStorage.getItem('reviewAttempted') : 'false';
    console.log(storedValue)
    setReviewAttempted(storedValue === 'true')
    setStateLoaded(true)
  }, [])

  useEffect(() => {
    console.log("updating the value of reviewAttempted")
    console.log(reviewAttempted)
    if(stateLoaded)
      localStorage.setItem('reviewAttempted', reviewAttempted.toString());
  }, [reviewAttempted]);

  function onGetFeedback() {
    if (!reviewAttempted) {
      setReviewAttempted(true);
    }
  }

  function setFeedback() {
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full bg-white shadow-md fixed top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold text-blue-600">
            Inkwell<span className="text-green-500">AI</span>
          </h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <a href="#features" className="text-gray-700 hover:text-blue-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="/subscribe" className="text-gray-700 hover:text-blue-600">
                  Pricing
                </a>
              </li>
            </ul>
          </nav>
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white shadow-md">
            <ul className="flex flex-col space-y-4 p-4">
              <li>
                <a href="#features" className="text-gray-700 hover:text-blue-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="/subscribe" className="text-gray-700 hover:text-blue-600">
                  Pricing
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-grow mt-16 hero-element">
        <section className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-6">Write Technical Content that Drives Results</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Stand out with high-quality, expertly-reviewed technical writing that wins clients, grows your audience, and boosts your revenue.
            </p>
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition duration-300"
            >
              <FaGoogle className="mr-2" /> Login with Google
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold text-center mb-12">Why Choose InkwellAI?</h3>
            <div className="flex flex-wrap -mx-4">
              <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <div className="text-5xl text-orange-600 mb-4">
                    <FaCheckCircle />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Empower Your Voice—We Enhance, You Create</h4>
                  <p className="text-gray-700">
                    Unlike content generators, we enhance your expertise. Our platform sharpens your technical writing, giving you full control over your content.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <div className="text-5xl text-blue-600 mb-4">
                    <FaCheckCircle />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Tailored Technical Feedback</h4>
                  <p className="text-gray-700">
                    Receive feedback tailored to technical articles, ensuring your work is not only well-written but accurate and impactful.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <div className="text-5xl text-green-500 mb-4">
                    <FaCheckCircle />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Instant Feedback</h4>
                  <p className="text-gray-700">
                    Simply paste your draft into our editor and receive instant feedback on clarity, structure, and technical correctness.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/4 px-4">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <div className="text-5xl text-purple-600 mb-4">
                    <FaCheckCircle />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Optimize for Your Audience</h4>
                  <p className="text-gray-700">
                    From tutorials to whitepapers, optimize your content for your technical audience with guidance on language and terminology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">What Our Users Are Saying</h3>
            <div className="flex flex-wrap -mx-4">
              <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                  <div className="text-3xl text-blue-600 mb-4">
                    <FaQuoteLeft />
                  </div>
                  <p className="text-gray-700 mb-6">
                    "InkwellAI helped me turn a rough technical blog into a clear, well-structured article that resonated with my audience."
                  </p>
                  <div className="flex items-center">
                    <img src="/user1.webp" alt="Eleanor Morgan" className="w-12 h-12 rounded-full" />
                    <div className="ml-4">
                      <p className="font-bold">Eleanor Morgan</p>
                      <p className="text-sm text-gray-600">Technical Writer</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                  <div className="text-3xl text-green-500 mb-4">
                    <FaQuoteLeft />
                  </div>
                  <p className="text-gray-700 mb-6">
                    "The AI gave me the insights I needed to improve my technical reports, and it only took minutes."
                  </p>
                  <div className="flex items-center">
                    <img src="/user2.webp" alt="Michael Carter" className="w-12 h-12 rounded-full" />
                    <div className="ml-4">
                      <p className="font-bold">Michael Carter</p>
                      <p className="text-sm text-gray-600">Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 px-4">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                  <div className="text-3xl text-purple-600 mb-4">
                    <FaQuoteLeft />
                  </div>
                  <p className="text-gray-700 mb-6">
                    "InkwellAI made my technical articles clear and engaging, helping me gain credibility in my field."
                  </p>
                  <div className="flex items-center">
                    <img src="/user3.webp" alt="Damian Turner" className="w-12 h-12 rounded-full" />
                    <div className="ml-4">
                      <p className="font-bold">Damian Turner</p>
                      <p className="text-sm text-gray-600">Software Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Try it for yourself Section */}
        <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-4xl font-bold mb-6">Try It For Yourself</h3>
            <p className="text-xl mb-8 max-w-xl mx-auto">
              Experience InkwellAI's technical feedback for free. Paste your content into our editor and see how you can improve instantly.
            </p>
            {reviewAttempted && <ProAd />}
             {/* Main Content */}
             <EditorComponent 
             settings={{
                title: 'Try It For Yourself',
                showButtonBar: false,
                getFeedbackEnabled: !reviewAttempted
             }}
             onGetFeedback={onGetFeedback}
             setFeedback={setFeedback}
                genre="techincal"
                type="article"
             />
             <br/>
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="inline-flex items-center px-6 py-3 bg-white text-green-500 font-semibold rounded-full shadow-md hover:bg-gray-100 transition duration-300"
            >
              <FaGoogle className="mr-2" /> Sign-up now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} InkwellAI. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a> |{' '}
            <a href="#" className="text-gray-400 hover:text-white mx-2">Terms of Service</a> |{' '}
            <a href="#" className="text-gray-400 hover:text-white mx-2">Contact Us</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
