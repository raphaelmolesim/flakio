
import { React, useEffect, useState, useRef } from 'react';

export function TestReact({ data }) {
  console.log("Rendering test");
  [internalData, setInternalData] = useState([]);
  //const internalData = useRef([])

  useEffect(() => {
    console.log("===> useEffect", data.length)
    setInternalData(data)
    //internalData.current = data
  } , [data])

  const content = internalData.length > 0 ? internalData.length : "No Data"

  
    return <p>{content}</p>
  
  
}