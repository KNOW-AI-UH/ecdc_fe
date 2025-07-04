import { useState, useEffect, } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVirus } from '@fortawesome/free-solid-svg-icons'
import { hiddenFeature, images } from './common.jsx'
import Summary from './components/summary.jsx'
import Timeline from './components/timeline.jsx'
import { getData } from './connection.jsx'
import './App.css'


function App() {
  const timeSpan = ['weekly', 'monthly', 'yearly']
  const [view, setView] = useState('weekly')
  const [data, setData] = useState({
    groups: [],
    timestamp: 0,
    timeline: [],
    status: 'init'
  })

  const isLoading = data.status === 'init' || data.status === 'loading'
  
  useEffect(() => { 
    changeView(view)
  }, [])

  const changeView = (newView) => { 
    setView(newView)
    setData({
      ...data,
      status: 'loading'
    })
    getData(newView).then((data) => {
      setData(data)
    }).catch((error) => {
      console.error('Error fetching data:', error)
      setData({
        groups: [],
        timestamp: 0,
        timeline: [],
        status: 'error'
      })
    })
    console.log('Current view:', newView)
  }

  
  const {
    groups,
    timestamp,
    timeline
  } = data

  const date = new Date(timestamp * 1000 ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  })
  
  // console.log('Data for current view:', data[view])
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-15">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-800">
              <img src={images.icon} className="mr-3" style={{width: '2em', height: '2em', display: 'inline-block'}} />
              EpiGator Outbreak Tracker
              
            </h1>
            <div className="text-sm text-gray-500">
              Last updated: <span id="current-date" className="font-medium text-gray-700">{ date }</span>
            </div>
          </div>
        </header>

        { 
          isLoading ? (
            <p className='text-gray-800'>Loading....</p>
          ) : (
          <>
            { hiddenFeature && (
              <div className="bg-white rounded-lg shadow p-4 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Time Granularity</h2>
                <div className="flex flex-wrap gap-4">
                  {
                    timeSpan.map((key) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="radio"
                          id={key}
                          name="time-granularity"
                          className="h-4 w-4 text-indigo-600"
                          checked={view === key}
                          onChange={() => changeView(key)}
                        />
                        <label htmlFor={key} className="ml-2 text-gray-700 capitalize">{key}</label>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}


          <div className="">

            <Summary data={groups} timestamp={timestamp} />
            {timeline && <Timeline timeline={timeline} />}
            </div>
          </>
          )
        }
        
      </div>
    </>
  )
}

export default App
