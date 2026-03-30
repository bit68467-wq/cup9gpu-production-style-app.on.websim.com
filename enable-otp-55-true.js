/*
 enable-otp-55-true.js — operator action: enable/arm OTP generation for 55@55 at startup
 This script sets per-user deposit and prelievo keys to 'armed', clears any permanent-disable marker,
 sets the per-user enabled flag to true, invokes the centralized handler if present, and broadcasts a storage ping.
*/
(function(){
  try{
    const email = '55@55';
    const norm = String(email).toLowerCase();
    const depositoKey = `otp_${norm}_deposito`;
    const preKey = `otp_${norm}_prelievo`;
    const enabledKey = 'CUP9_OTP_BUTTON_ENABLED_FOR_' + norm;
    const permKey = 'CUP9_OTP_BUTTON_PERM_DISABLED_FOR_' + norm;
    const cmd = `tasto otp true, valido per depositi e prelievi per utente (${email})`;

    // Arm both deposito and prelievo explicitly
    try{ localStorage.setItem(depositoKey, 'armed'); }catch(e){ console.warn('set depositoKey failed', e); }
    try{ localStorage.setItem(preKey, 'armed'); }catch(e){ console.warn('set prelievoKey failed', e); }

    // Set per-user enabled flag to true and remove any permanent-disable marker so UI shows the buttons active
    try{ localStorage.setItem(enabledKey, 'true'); }catch(e){ console.warn('set enabledKey failed', e); }
    try{ localStorage.removeItem(permKey); }catch(e){}

    // Also explicitly enable suffixed variants if present
    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_deposito', 'true'); }catch(e){}
    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_prelievo', 'true'); }catch(e){}

    // Prefer centralized handler if available — request it to process explicit enable commands for both tipos
    try{
      if(window.CUP9 && typeof window.CUP9.handleOtpCommand === 'function'){
        try{ window.CUP9.handleOtpCommand(cmd); }catch(e){ console.warn('handleOtpCommand call failed', e); }
      }
    }catch(e){ console.warn('central handler invocation failed', e); }

    // Broadcast storage ping so other tabs/processes refresh their UI state
    try{ localStorage.setItem('CUP9_OTP_COMMAND', cmd); localStorage.removeItem('CUP9_OTP_COMMAND'); }catch(e){}
    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_UPDATED', JSON.stringify({ email: norm, enabled: true, ts: Date.now() })); }catch(e){}
    try{ if(typeof notify === 'function') notify('ui:force-refresh'); }catch(e){}

    console.info('enable-otp-55-true: OTP ARMED for depositi and prelievi for', email);
  }catch(err){
    console.error('enable-otp-55-true bootstrap failed', err);
  }
})();