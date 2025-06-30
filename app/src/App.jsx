import { useState, useEffect, } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVirus, faCalendarAlt, faHistory, faChartLine } from '@fortawesome/free-solid-svg-icons'
import weekly from '../data/weekly.json' with { type: 'json' }
import monthly from '../data/monthly.json' with { type: 'json' }
import yearly from '../data/yearly.json' with { type: 'json' }
import { hiddenFeature } from './common.jsx'
import Summary from './components/summary.jsx'
import Timeline from './components/timeline.jsx'
import './App.css'


function App() {
  const [view, setView] = useState('weekly')
  const data = {
    weekly,
    monthly,
    yearly
  }

  // timestamp to display in the header
  const { 
    groups,
    timestamp,
    timeline
  } = data[view]

  const date = new Date(timestamp * 1000 ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  })
  console.log('Current view:', view)
  // console.log('Data for current view:', data[view])
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-800">
              <FontAwesomeIcon icon={faVirus} className="mr-3 text-red-500" />
              COVID-19 Outbreak Tracker
              
            </h1>
            <div className="text-sm text-gray-500">
              Last updated: <span id="current-date" className="font-medium text-gray-700">{ date }</span>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive tracking of COVID-19 outbreaks worldwide with detailed news analysis and timeline visualization.
          </p>
        </header>


        { hiddenFeature && (
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Time Granularity</h2>
            <div className="flex flex-wrap gap-4">
              {
                Object.keys(data).map((key) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="radio"
                      id={key}
                      name="time-granularity"
                      className="h-4 w-4 text-indigo-600"
                      checked={view === key}
                      onChange={() => setView(key)}
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
      </div>
    </>
  )
}

export default App
