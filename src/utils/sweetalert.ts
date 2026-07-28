import Swal from "sweetalert2";

const success = (message?: string, title = "Success") => {
    return Swal.fire({
        icon: "success",
        title,
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#198754",
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
        confirmButtonColor: "#0dcaf0",
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
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#dc3545",
    });
};

export const sweetalert = {
    success,
    error,
    warning,
    confirm,
    info,
};
