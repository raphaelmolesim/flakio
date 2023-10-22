import * as ReactDOM from 'react-dom/client';

export function isEmpty(element) {
  if (element === undefined || element === null || element.length === 0)
    return true
  else
    return false
}

export function goToPage(page){
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(page) 
}