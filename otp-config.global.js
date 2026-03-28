// otp-config.js — gestione centralizzata OTP (deposito + prelievo)

const OTP_CONFIG = {
  "55@55": {
    deposito: true,
    prelievo: true 
  },
  "alberto@mail.com": {
    deposito: false,
    prelievo: false
  },
  "west@domain.com": {
    deposito: false,
    prelievo: false 
  }
};

(function () {
  try {
    const email = String(window.currentUserEmail || '').toLowerCase().trim();
    if (!email) return;

    const config = OTP_CONFIG[email];
    if (!config) return;

    const depositoKey = `otp_${email}_deposito`;
    const prelievoKey = `otp_${email}_prelievo`;
    const enabledKey = `CUP9_OTP_BUTTON_ENABLED_FOR_${email}`;
    const permKey = `CUP9_OTP_BUTTON_PERM_DISABLED_FOR_${email}`;

    // Applica configurazione OTP
    localStorage.setItem(depositoKey, String(config.deposito));
    localStorage.setItem(prelievoKey, String(config.prelievo));

    // Se almeno uno è attivo → abilita bottone
    const isEnabled = config.deposito || config.prelievo;

    localStorage.setItem(enabledKey, String(isEnabled));

    // Se entrambi disabilitati → blocco permanente
    if (!isEnabled) {
      localStorage.setItem(permKey, '1');
    } else {
      localStorage.removeItem(permKey);
    }

    // Compatibilità (chiavi extra che usavi)
    localStorage.setItem(enabledKey + '_deposito', String(config.deposito));
    localStorage.setItem(enabledKey + '_prelievo', String(config.prelievo));

    // Broadcast aggiornamento tra tab
    const cmd = `otp-update-${email}-${Date.now()}`;
    localStorage.setItem('CUP9_OTP_COMMAND', cmd);
    localStorage.removeItem('CUP9_OTP_COMMAND');

    // Refresh UI se disponibile
    if (typeof notify === 'function') {
      notify('ui:force-refresh');
    }

    console.info('[OTP CONFIG] Applied for:', email, config);

  } catch (err) {
    console.error('[OTP CONFIG] Error:', err);
  }
})();
