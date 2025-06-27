import { useState, useEffect, } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHistory } from '@fortawesome/free-solid-svg-icons'


const Timeline = ({ timeline }) => { 

    const [open, setOpen] = useState(false)
    const events = open ? timeline : timeline.slice(0, 3)

    const dateFormat = {
        month: 'long',
        day: 'numeric',
    }

    return (
        <div>
            <div className="bg-white rounded-lg shadow overflow-hidden sticky top-4">
                <div className="bg-indigo-700 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Outbreak Timeline</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {
                            events.map((event, index) => (
                                <div key={index} className="relative timeline-item pl-6">
                                    <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-indigo-100"></div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-gray-800">{event.title}</h4>
                                            <span className="text-xs text-gray-500">{event.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="mt-6">
                        <button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            onClick={() => setOpen(!open)
                        }>
                            <FontAwesomeIcon icon={faHistory} className="mr-2" /> View Full Timeline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Timeline