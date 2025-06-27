import { useState, useEffect, } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { faVirus, faCalendarAlt, faTimes, faChartLine } from '@fortawesome/free-solid-svg-icons'

const Event = ({ event }) => { 
    const [open, setOpen] = useState(false)
    const { title, entities, text, date } = event

    const dateFormat = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    const randomColor = () => {
        const colors = ['red', 'blue', 'green', 'yellow', 'purple']
        return colors[Math.floor(Math.random() * colors.length)]
    }

    return (
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => setOpen(true)}>
            <h4 className="font-medium text-gray-800 mb-2">{title}</h4>
            <p className="text-sm text-gray-500 mb-2">{date}</p>
            <div className="flex flex-wrap gap-1">
                {entities.map((entity, entityIndex) => {
                    const color = randomColor()
                    return (
                        <span key={entityIndex} className={`bg-${color}-100 text-${color}-800 text-xs px-2 py-1 rounded`}>{entity.name}</span>
                    )
                })}
            </div>
            <Dialog open={open} onClose={setOpen}
                className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                        <div className="bg-indigo-700 px-6 py-4 flex justify-between items-center">
                            <DialogTitle className="text-lg font-semibold text-white">Event Extraction Results</DialogTitle >
                            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div id="modal-content">
                                { text ? text : 'No text available for this event.' }
                            </div>
                        </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>



        </div>
    )
}


const Record = ({ record }) => {
    const {
        title,
        status,
        time,
        summary,
        events,
        description,
    } = record

    const statusString = status[0].toUpperCase() + status.slice(1).toLowerCase()
    const statusStyleMapper = {
        active: 'red',
        monitoring: 'yellow',
    }

    

    return (
        <div className="mb-10 pb-6 border-b border-gray-200 last:border-0">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <span className={`bg-${statusStyleMapper[status]}-100 text-${statusStyleMapper[status]}-800 text-xs font-medium px-2.5 py-0.5 rounded`}>{statusString }</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                <span>{ time }</span>
            </div>
            <p className="text-gray-600 mb-4">
                { description }
            </p>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {events.map((event, index) => (
                    <Event key={index} event={event} />
                ))}
                
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                    Outbreak Summary
                </h4>
                <p className="text-gray-700">
                    { summary }
                </p>
            </div>
        </div>
    )
}

const Summary = ({ data }) => { 
    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-indigo-700 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Recent Outbreaks Summary</h2>
                </div>
                <div className="p-6">
                    {
                        data.map((record, index) => (
                            <Record key={index} record={record} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}


export default Summary