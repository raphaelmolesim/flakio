import { Header } from "../../components/basic_elements"
import { MainContent } from "../../components/main_content"
import { LayoutPage } from "../../components/layout_page"
import { useEffect, useState } from "react"
import { API } from "../../services/api"
import { useLogger } from "../../hooks/use_logger"
import { OverviewService } from "../../services/overview_service"
import { useLogger } from "../../hooks/use_logger"
import { Graph } from "./graph"
import { TestReact } from "./test"

export function OverviewPage() {
  const [graphData, setGraphData] = useState([])
  const logger = useLogger("OverviewPage")

  useEffect(() => {
    const overviewService = new OverviewService()
    overviewService.numberOfTestPerJob(function(response) {
      console.log("response", response)
      setGraphData(response)
    })  
  }, [])

  function renderJsonData(data) {
    console.log(" render table>  ", data)
    const trs = data.map(element => {
      return (<tr>
        <td>{element["handled_finished_at"]}</td>
        <td>{element["job_name"]}</td>
        <td>{element["count(line)"]}</td>
      </tr>)
    });
    return (
      <table>
        <tbody>
          <tr>
            <td>Day</td>
            <td>Job</td>
            <td>Number of tests</td>
          </tr>
          { trs   }
        </tbody>
      </table>
    );
  }

  return (
    <LayoutPage>
      <MainContent>
        <Header text="Overview" />

        <p>
          See the data
        </p>

        <div className="mt-4">
          <TestReact data={graphData} />
        </div>

        <div className="mt-4">
          <Graph data={graphData} />
        </div>

        <div className="mt-4">
          {renderJsonData(graphData)}
        </div>

      </MainContent>
    </LayoutPage>
  )
}