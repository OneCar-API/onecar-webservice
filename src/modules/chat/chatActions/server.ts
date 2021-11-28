import { serverHttpSocket } from "./http";
import "./socketActions";
import "../../infra"

serverHttpSocket.listen(3334, () => console.log("Server is running on PORT 3334"));
