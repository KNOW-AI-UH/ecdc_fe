import { useState, useEffect, } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import {
    faCalendarAlt,
    faTimes,
    faChartLine,
    faNewspaper,
    faTags,
    faBolt,
    faChartBar,
    faFileAlt as faFile,
} from '@fortawesome/free-solid-svg-icons'

const Event = ({ event }) => { 
    const [open, setOpen] = useState(false)
    const {
        disease_name_text: title,
        location_of_the_outbreak: location,
        entities,
        actions,
        number_of_cases,
        number_of_deaths,
        summary,
        outbreak_start_date: date,
        is_the_outbreak_over: is_over,
        original_text: originalText,
    } = event

    const statusStringMapper = {
        yes: 'Over',
        no: 'Ongoing',
        unknown: 'Unknown status',
    }
    const statusStyleMapper = {
        yes: 'bg-green-100 text-green-800',
        no: 'bg-red-100 text-red-800',
        unknown: 'bg-gray-100 text-gray-800',
    }

    const dateFormat = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    const statistics = [
        { label: 'Total Cases', value: number_of_cases.value, description: '' },
        { label: 'Total Deaths', value: number_of_deaths.value, description: '' },
    ]

    const randomColor = () => {
        const colors = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500']
        return colors[Math.floor(Math.random() * colors.length)]
    }
    const locationStringShort = location.value.length > 30 ? `${location.value.slice(0, 30)}...` : location.value

    return (
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => setOpen(true)}>
            <h4 className="font-medium text-gray-800 mb-2">{title}</h4>
            <p className="text-sm text-gray-500 mb-2">{ location.value } - {date.value}</p>
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
                            style={{ maxWidth: '60em' }}
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                        <div className="bg-indigo-700 px-6 py-4 flex justify-between items-center">
                            <DialogTitle className="text-lg font-semibold text-white">Event Extraction Results</DialogTitle >
                            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div id="modal-content">
                                <h4 className="text-xl font-semibold text-gray-800 mb-2"> {title} </h4>
                                <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center text-sm text-gray-500 ">
                                        <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
                                        {locationStringShort} - {date.value}

                                        </div>
                                    
                                    <span className={
                                        `${statusStyleMapper[is_over.value.toLowerCase()]} text-xs font-medium px-2.5 py-0.5 rounded`}>
                                        {statusStringMapper[is_over.value.toLowerCase()]}
                                    </span>            
                                </div>
                                
                                {
                                    summary?.length  && (
                                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                                            <h5 className="font-medium text-blue-800 mb-2">Summary</h5>
                                            <p className="text-gray-700"> { summary } </p>
                                        </div>
                                    )       
                                }

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {
                                        entities?.length && (
                                            <div>
                                                <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                                    <FontAwesomeIcon icon={faTags} className="mr-2 text-indigo-600" />    
                                                    Extracted Entities
                                                </h5>

                                                {
                                                    entities.map((entity, index) => (
                                                        <div key={index} className="bg-gray-50 p-3 rounded-lg mb-3">
                                                            <div className="flex justify-between items-start">
                                                                <span className="font-medium text-gray-800">{entity.name}</span>
                                                                <span className={`text-xs px-2 py-1 rounded bg-${entity.type.color}-100 text-${entity.type.color}-800`}>
                                                                    {entity.type.label}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600 mt-1">Relevance: {entity.relevance}</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                    { 
                                        actions?.length && (
                                            <div>
                                                <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                                    <FontAwesomeIcon icon={faBolt} className="mr-2 text-indigo-600" />    
                                                    Actions &amp; Events
                                                </h5>

                                                {
                                                    actions.map((action, index) => (
                                                        <div className="border-l-4 border-indigo-200 pl-3 mb-3">
                                                            <div className="text-sm font-medium text-gray-800"> {action.action}</div>
                                                            <div className="text-xs text-gray-500">Actor: {action.actor}</div>
                                                            <div className="text-xs text-gray-500">Target: {action.target}</div>
                                                        </div>
                                                    ))
                                                }

                                            </div>
                                        )
                                    }
                                </div>

                                {statistics?.length && (<div>
                                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                        <FontAwesomeIcon icon={faChartBar} className="mr-2 text-indigo-600" />     
                                        Key Statistics
                                    </h5>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        { 
                                            statistics.map((stat, index) => (
                                                <div key={index} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                                                    <div className="w-1/3 font-medium text-gray-700">{stat.label}</div>
                                                    <div className="w-1/3 text-indigo-600 font-medium">{stat.value}</div>
                                                    <div className="w-1/3 text-xs text-gray-500">{stat.description}</div>
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>)}
                                    
                                <div className='mt-6'>
                                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                        <FontAwesomeIcon icon={faFile} className="mr-2 text-indigo-600" />
                                        Source Text:
                                    </h5>
                                    <p className="text-sm text-gray-700 text-justify">{originalText}</p>        
                                </div>
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
    // console.log('Record date:', date, 'Timestamp:', timestamp, 'Dow:', dow)
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

            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-indigo-800 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                    Outbreak Summary
                </h4>
                <ul className="list-disc pl-5">
                    {
                        Object.keys(summary.summary).map((key, index) => (
                            <li key={index} className="block text-gray-700 mb-1">
                                <strong>- {key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                                <p className="text-gray-600 text-sm text-justify">
                                    {summary.summary[key]}
                                </p>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {events.map((event, index) => (
                    <Event key={index} event={event} />
                ))}
                
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