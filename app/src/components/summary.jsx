import { useState, useEffect, } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { faVirus, faCalendarAlt, faTimes, faChartLine } from '@fortawesome/free-solid-svg-icons'

const Event = ({ event }) => { 
    const [open, setOpen] = useState(false)
    const {
        disease_name_text: title,
        entities,
        actions,
        statistics,
        summary,
        outbreak_start_date: date
    } = event
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
            <p className="text-sm text-gray-500 mb-2">{date.value}</p>
            {/* <div className="flex flex-wrap gap-1">
                {entities.map((entity, entityIndex) => {
                    const color = randomColor()
                    return (
                        <span key={entityIndex} className={`bg-${color}-100 text-${color}-800 text-xs px-2 py-1 rounded`}>{entity.name}</span>
                    )
                })}
            </div> */}
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
                                    <h4 class="text-xl font-semibold text-gray-800 mb-2"> {title} </h4>
                                <div class="flex items-center text-sm text-gray-500 mb-4">
                                    <i class="fas fa-newspaper mr-2"></i> {date.value }
                                </div>

                                {
                                    summary?.length  && (
                                        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                                            <h5 class="font-medium text-blue-800 mb-2">Summary</h5>
                                            <p class="text-gray-700"> { summary } </p>
                                        </div>
                                    )       
                                }

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {
                                        entities?.length && (
                                            <div>
                                                <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                                                    <i class="fas fa-tags mr-2 text-indigo-600"></i> Extracted Entities
                                                </h5>

                                                {
                                                    entities.map((entity, index) => (
                                                        <div key={index} class="bg-gray-50 p-3 rounded-lg mb-3">
                                                            <div class="flex justify-between items-start">
                                                                <span class="font-medium text-gray-800">{entity.name}</span>
                                                                <span class={`text-xs px-2 py-1 rounded bg-${entity.type.color}-100 text-${entity.type.color}-800`}>
                                                                    {entity.type.label}
                                                                </span>
                                                            </div>
                                                            <div class="text-sm text-gray-600 mt-1">Relevance: {entity.relevance}</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                    { 
                                        actions?.length && (
                                            <div>
                                                <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                                                    <i class="fas fa-bolt mr-2 text-indigo-600"></i> Actions &amp; Events
                                                </h5>

                                                {
                                                    actions.map((action, index) => (
                                                        <div class="border-l-4 border-indigo-200 pl-3 mb-3">
                                                            <div class="text-sm font-medium text-gray-800"> {action.action}</div>
                                                            <div class="text-xs text-gray-500">Actor: {action.actor}</div>
                                                            <div class="text-xs text-gray-500">Target: {action.target}</div>
                                                        </div>
                                                    ))
                                                }

                                            </div>
                                        )
                                    }
                                </div>

                                {statistics?.length && (<div>
                                    <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                                        <i class="fas fa-chart-bar mr-2 text-indigo-600"></i> Key Statistics
                                    </h5>
                                    <div class="bg-gray-50 rounded-lg p-3">
                                        { 
                                            statistics.map((stat, index) => (
                                                <div key={index} class="flex items-center py-2 border-b border-gray-100 last:border-0">
                                                    <div class="w-1/3 font-medium text-gray-700">{stat.label}</div>
                                                    <div class="w-1/3 text-indigo-600 font-medium">{stat.value}</div>
                                                    <div class="w-1/3 text-xs text-gray-500">{stat.description}</div>
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>)}
                            </div>
                        </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>



        </div>
    )
}


const Record = ({ record, timestamp }) => {
    const {
        disease_name,
        // status,
        // time,
        summary,
        events,
        // description,
    } = record

    // const statusString = status[0].toUpperCase() + status.slice(1).toLowerCase()
    // const statusStyleMapper = {
    //     active: 'red',
    //     monitoring: 'yellow',
    // }

    const date = new Date(timestamp * 1000)
    const dow = date.getDay() ? date.getDay() : 7 // Adjust for Sunday as 0
    const weekStartTimestamp = timestamp - (dow * 24 * 60 * 60) // Adjust timestamp to start of the week
    const weekEndTimestamp = timestamp + ((6 - dow) * 24 * 60 * 60) // Adjust timestamp to end of the week
    console.log('Record date:', date, 'Timestamp:', timestamp, 'Dow:', dow)
    const startDate = new Date(weekStartTimestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    const endDate = new Date(weekEndTimestamp * 1000 ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="mb-10 pb-6 border-b border-gray-200 last:border-0">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{disease_name}</h3>
                {/* <span className={`bg-${statusStyleMapper[status]}-100 text-${statusStyleMapper[status]}-800 text-xs font-medium px-2.5 py-0.5 rounded`}>{statusString }</span> */}
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                <span>{startDate} - { endDate }</span>
            </div>
            {/* <p className="text-gray-600 mb-4">
                { description }
            </p> */}


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
                <ul className="list-disc pl-5">
                {
                    Object.keys(summary.summary).map((key, index) => (
                        <li key={index} className="block text-gray-700 mb-1">
                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                            <p className="text-gray-600 text-sm">
                                {summary.summary[key]}
                            </p>
                        </li>
                    ))
                }
                </ul>
            </div>
        </div>
    )
}

const Summary = ({ data, timestamp }) => { 
    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-indigo-700 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Recent Outbreaks Summary</h2>
                </div>
                <div className="p-6">
                    {
                        data.map((record, index) => (
                            <Record key={index} record={record} timestamp={timestamp} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}


export default Summary