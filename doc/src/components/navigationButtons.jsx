// navigationButtons.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

// Array of pages and their corresponding names
const pages = [
  { path: '/', name: 'Introduction' },
  { path: '/features', name: 'Features' },
  { path: '/installation', name: 'Installation' },
  { path: '/quickstart', name: 'QuickStart' },
  { path: '/helloworld', name: 'HelloWorld' }
]

const NavigationButtons = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Find the current page index
  const currentIndex = pages.findIndex(page => page.path === location.pathname)

  // Handlers for navigating backward and forward
  const handleBack = () => {
    if (currentIndex > 0) {
      navigate(pages[currentIndex - 1].path)
      window.scrollTo(0, 0) // Scroll to top of the page after navigation
    }
  }

  const handleForward = () => {
    if (currentIndex < pages.length - 1) {
      navigate(pages[currentIndex + 1].path)
      window.scrollTo(0, 0) // Scroll to top of the page after navigation
    }
  }

  return (
    <div className='navigation-buttons'>
      <button onClick={handleBack} disabled={currentIndex === 0}>
        Back to {currentIndex > 0 ? pages[currentIndex - 1].name : ''}
      </button>
      <button onClick={handleForward} disabled={currentIndex === pages.length - 1}>
        Forward to {currentIndex < pages.length - 1 ? pages[currentIndex + 1].name : ''}
      </button>
    </div>
  )
}

export default NavigationButtons
