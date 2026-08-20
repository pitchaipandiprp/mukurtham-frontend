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

const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: "custom-toast",
    },
});
const showToast = (message?: string, title?: string, icon?: "success" | "error" | "warning" | "info") => {
    const background = {
        success: "#198754",
        error: "#dc3545",
        warning: "#ffc107",
        info: "#A2004B",
    }[icon || "info"];

    return Toast.fire({
        icon,
        text: message,
        background,
        color: "#ffffff",
    });
};

const toastSuccess = (message?: string, title = "Success") => {
    showToast(message, title, "success");
};

const toastError = (message?: string, title = "Error") => {
    showToast(message, title, "error");
};

const toastWarning = (message?: string, title = "Warning") => {
    showToast(message, title, "warning");
};

const toastInfo = (message?: string, title = "Info") => {
    showToast(message, title, "info");
};


export const sweetalert = {
    success,
    error,
    warning,
    confirm,
    info,
    showToast,
    toastSuccess,
    toastError,
    toastWarning,
    toastInfo,

};
