import React, { useEffect, useState } from 'react'
import PaginationControls from '../Pagination/PaginationControls'
import axios from 'axios'

import './StationTable.scss'
import { stations } from '../../models/Station'
import { StationPage } from '../../models/Page/StationPage'

function Table() {

  const [language, setLanguage] = useState("Finnish")
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  const [stationData, setStationData] = useState<stations[]>([])

  const getData = async () => {
    const result = await axios.get<StationPage>(`http://localhost:8080/stations?page=${page}&perPage=${itemsPerPage}`)
    setStationData(result.data.data)
    setTotalItems(result.data.total)
  }

  useEffect(() => {
    getData()
  }, [page, itemsPerPage])

  return (
    <div className='relative'>
      {/* Data table */}
      <table className='grow sm:inline-table w-full flex flex-row text-sm text-left text-slate-500 sm:table-auto'>
        <thead className='text-sm text-slate-600 uppercase'>
          {stationData.map(s => 
            <tr className='bg-indigo-50 flex flex-col flex-nowrap sm:table-row mb-2 sm:mb-0 rounded-l-lg border-b border-t border-r border-indigo-50' key={s.id}>
              <th scope='col' className='rounded-tl-xl sm:rounded-none bg-indigo-50 py-3 px-6 '>id</th>
              <th scope='col' className='bg-indigo-50 py-3 px-6'>name</th>
              <th scope='col' className='bg-indigo-50 py-3 px-6 hidden md:table-cell'>capacity</th>
              <th scope='col' className='bg-indigo-50 py-3 px-6 hidden lg:table-cell'>operator</th>
              <th scope='col' className='bg-indigo-50 py-3 px-6 '>city</th>
              <th scope='col' className='rounded-bl-xl sm:rounded-none bg-indigo-50 py-3 px-6'>address</th>
          </tr>)}
        </thead>
        <tbody className='flex-1 sm:flex-none'>
          {stationData.map(station => 
            <tr className='text-sm bg-white border-b border-t border-r sm:border-l border-indigo-50 hover:bg-indigo-50 flex flex-col sm:table-row mb-2 sm:mb-0 rounded-r-xl flex-wrap' key={station.id}>
              <th scope='row' className='py-3 px-6 text-slate-700'>{station.id}</th>
              <td className='py-3 px-6 truncate'>{language === "Finnish" ? station.name_fi : language === "Swedish" ? station.name_se : station.name_en}</td>
              <td className='py-3 px-6 hidden md:table-cell'>{station.capacity}</td>
              <td className='py-3 px-6 hidden lg:table-cell'>{station.operator != " " ? station.operator : "‎"}</td>
              <td className='py-3 px-6'>{language === "Swedish" ? station.city_se != " " ? station.city_se : "‎" : (station.city_fi != " " ? station.city_fi : "‎")}</td>
              <td className='py-3 px-6 truncate'>{language === "Swedish" ? station.address_se : station.address_fi}</td>
            </tr>)}
        </tbody>
      </table>
      
      <PaginationControls 
      setLanguage={setLanguage} 
      setPage={setPage} 
      page={page} 
      setItemsPerPage={setItemsPerPage} 
      itemsPerPage={itemsPerPage}
      lastPage={totalItems/itemsPerPage}/>

    </div>
  )
}

export default Table