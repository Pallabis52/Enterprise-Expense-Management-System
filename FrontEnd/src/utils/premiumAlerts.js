import Swal from 'sweetalert2';

/**
 * Shows an ultra-premium SweetAlert
 * @param {Object} options - SweetAlert options
 * @param {string} options.icon - success, error, warning, info, question
 * @param {string} options.title - The title of the alert
 * @param {string} options.text - The text content
 * @param {boolean} options.showConfirmButton - Whether to show the confirm button
 * @param {number} options.timer - Auto-close timer in ms
 * @param {boolean} options.showCancelButton - Whether to show the cancel button
 * @param {string} options.confirmButtonText - Text for confirm button
 * @param {string} options.cancelButtonText - Text for cancel button
 * @returns {Promise} - Swal promise
 */
export const showPremiumAlert = ({
    icon = 'success',
    title = '',
    text = '',
    showConfirmButton = true,
    timer = null,
    showCancelButton = false,
    confirmButtonText = 'OK',
    cancelButtonText = 'Cancel',
    ...rest
}) => {
    return Swal.fire({
        icon,
        title,
        text,
        showConfirmButton,
        timer,
        showCancelButton,
        confirmButtonText,
        cancelButtonText,
        customClass: {
            popup: 'premium-swal-popup',
            title: 'premium-swal-title',
            htmlContainer: 'premium-swal-text',
            confirmButton: 'premium-swal-confirm',
            cancelButton: 'premium-swal-cancel',
        },
        buttonsStyling: false, // Use our custom CSS
        ...rest,
    });
};

export const premiumSuccess = (title, text, timer = 2000) =>
    showPremiumAlert({ icon: 'success', title, text, timer, showConfirmButton: timer === null });

export const premiumError = (title, text) =>
    showPremiumAlert({ icon: 'error', title, text });

export const premiumWarning = (title, text) =>
    showPremiumAlert({ icon: 'warning', title, text });

export const premiumConfirm = (title, text, confirmText = 'Yes, proceed') =>
    showPremiumAlert({
        icon: 'question',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        showConfirmButton: true
    });

export default showPremiumAlert;
