import { ReactFlowProvider } from "reactflow";
import FlowEditor from "./components/flow/FlowEditor";
import FlowToolbar from "./components/flow/FlowToolbar";
import DslEditor from "./components/flow/DslEditor";

function App() {
  return (
    <div style={{ width: "100%", height: "100%", paddingBottom: "200px" }}>
      <ReactFlowProvider>
        <div>
          {" "}
          <FlowToolbar />
          <DslEditor />
        </div>
        <FlowEditor />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
