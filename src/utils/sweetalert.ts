import Swal from "sweetalert2";

const success = (message?: string, title = "Success") => {
    return Swal.fire({
        icon: "success",
        title,
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#A2004B",
    });
};

const error = (message?: string, title = "Error") => {
    return Swal.fire({
        icon: "error",
        title,
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545",
    });
};

const warning = (message?: string, title = "Warning") => {
    return Swal.fire({
        icon: "warning",
        title,
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#ffc107",
    });
};

const info = (message?: string, title = "Info") => {
    return Swal.fire({
        icon: "info",
        title,
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#A2004B",
    });
};

const confirm = (message?: string, title = "Confirm") => {
    return Swal.fire({
        icon: "question",
        title,
        text: message,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        width: "350px",
        padding: "1rem",
        confirmButtonColor: "#A2004B",
        cancelButtonColor: "#c64d84",
    });
};

export const sweetalert = {
    success,
    error,
    warning,
    confirm,
    info,
};
