import { QueryClient } from "@tanstack/react-query";
import { isFireBaseError } from "./utils/firebase";
import { hasOwnProperty, objectValues } from "./utils";
import { ErrorMessage, ErrorStates } from "./utils/wrapRequest";
import { isString } from "./utils/types";
function isErrorMessage(error: unknown): error is ErrorMessage {
    return (
        hasOwnProperty(error, "state") &&
        hasOwnProperty(error, "message") &&
        isString(error.message) &&
        objectValues(ErrorStates).some((val) => val == error.state)
    );
}
const cacheTime = 30 * (60 * 1000);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10 * (60 * 1000), // 10 mins
            cacheTime: cacheTime + 5 * (60 * 1000),
            retry(failureCount, error) {
                if (failureCount > 2) return false;

                if (isErrorMessage(error)) {
                    switch (error.state) {
                        case ErrorStates.UnknownRequest:
                            return true;
                        default:
                            return false;
                    }
                }
                return true;
            },
        },
    },
});
export default queryClient;
