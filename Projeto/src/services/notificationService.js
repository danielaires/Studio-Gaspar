// Serviço de notificações reutilizável
export const showNotification = (message, type = "success", duration = 3000) => {
  // Remove notificação anterior se existir
  const existingNotification = document.getElementById("notification-container");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Cria container
  const container = document.createElement("div");
  container.id = "notification-container";
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  // Define cores baseadas no tipo
  const colors = {
    success: { bg: "#28a745", border: "#1e7e34", text: "#fff" },
    error: { bg: "#dc3545", border: "#c82333", text: "#fff" },
    warning: { bg: "#ffc107", border: "#cc9a06", text: "#000" },
    info: { bg: "#17a2b8", border: "#0c5460", text: "#fff" },
  };

  const color = colors[type] || colors.success;

  // Cria elemento de notificação
  const notification = document.createElement("div");
  notification.style.cssText = `
    background-color: ${color.bg};
    color: ${color.text};
    padding: 16px 24px;
    border-radius: 8px;
    border-left: 4px solid ${color.border};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-weight: 500;
    font-size: 14px;
    max-width: 400px;
    word-wrap: break-word;
  `;

  notification.textContent = message;

  // Adiciona estilo de animação
  const style = document.createElement("style");
  if (!document.getElementById("notification-styles")) {
    style.id = "notification-styles";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(notification);
  document.body.appendChild(container);

  // Remove após o tempo especificado
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => container.remove(), 300);
  }, duration);
};

export const showSuccess = (message, duration = 3000) =>
  showNotification(message, "success", duration);

export const showError = (message, duration = 3000) =>
  showNotification(message, "error", duration);

export const showWarning = (message, duration = 3000) =>
  showNotification(message, "warning", duration);

export const showInfo = (message, duration = 3000) =>
  showNotification(message, "info", duration);
