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

export const showConfirmation = (
  message,
  {
    confirmText = "Confirmar",
    cancelText = "Cancelar",
  } = {}
) =>
  new Promise((resolve) => {
    const existing = document.getElementById("confirmation-overlay");
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement("div");
    overlay.id = "confirmation-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 11000;
      padding: 16px;
    `;

    const card = document.createElement("div");
    card.style.cssText = `
      background: #fff;
      border-radius: 12px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
      padding: 24px;
      text-align: center;
    `;

    const text = document.createElement("p");
    text.textContent = message;
    text.style.cssText = `
      margin-bottom: 24px;
      font-size: 16px;
      color: #2c3e50;
      line-height: 1.5;
    `;

    const actions = document.createElement("div");
    actions.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    `;

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = cancelText;
    cancelButton.style.cssText = `
      border: 1px solid #b3b3b3;
      background: #f8f9fa;
      color: #212529;
      border-radius: 8px;
      padding: 10px 18px;
      cursor: pointer;
      min-width: 110px;
      font-weight: 600;
    `;

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.textContent = confirmText;
    confirmButton.style.cssText = `
      border: none;
      background: #0d6efd;
      color: #fff;
      border-radius: 8px;
      padding: 10px 18px;
      cursor: pointer;
      min-width: 110px;
      font-weight: 600;
    `;

    const cleanup = (result) => {
      resolve(result);
      overlay.remove();
    };

    cancelButton.onclick = () => cleanup(false);
    confirmButton.onclick = () => cleanup(true);
    overlay.onclick = (event) => {
      if (event.target === overlay) {
        cleanup(false);
      }
    };

    actions.appendChild(cancelButton);
    actions.appendChild(confirmButton);
    card.appendChild(text);
    card.appendChild(actions);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  });

export const showSuccess = (message, duration = 3000) =>
  showNotification(message, "success", duration);

export const showError = (message, duration = 3000) =>
  showNotification(message, "error", duration);

export const showWarning = (message, duration = 3000) =>
  showNotification(message, "warning", duration);

export const showInfo = (message, duration = 3000) =>
  showNotification(message, "info", duration);
