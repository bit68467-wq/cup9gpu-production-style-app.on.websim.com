/*
 add-otp-55-manual-disable.js — explicit operator bootstrap: ensure OTP (depositi and prelievi) is disabled for 55@55
 This complements existing scripts by writing all common keys, invoking centralized handler when present,
 broadcasting a storage ping and notifying in-page listeners to enforce the disabled state across tabs.
*/
(function(){
  try{
    const email = '55@55';
    const norm = String(email).toLowerCase();
    const depositoKey = `otp_${norm}_deposito`;
    const preKey = `otp_${norm}_prelievo`;
    const enabledKey = 'CUP9_OTP_BUTTON_ENABLED_FOR_' + norm;
    const permKey = 'CUP9_OTP_BUTTON_PERM_DISABLED_FOR_' + norm;
    const cmd = `tasto otp false, non valido per depositi e prelievi per utente (${email})`;

    // Prefer centralized handler if available
    if(window.CUP9 && typeof window.CUP9.handleOtpCommand === 'function'){
      try{ window.CUP9.handleOtpCommand(cmd); }catch(e){ console.warn('handleOtpCommand call failed', e); }
    }

    try{
      // Explicitly set per-type keys to 'false' and persist permanent operator disable marker
      try{ localStorage.setItem(depositoKey, 'false'); }catch(e){}
      try{ localStorage.setItem(preKey, 'false'); }catch(e){}
      try{ localStorage.setItem(enabledKey, 'false'); }catch(e){}
      try{ localStorage.setItem(permKey, '1'); }catch(e){}
      try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_deposito', 'false'); }catch(e){}
      try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_prelievo', 'false'); }catch(e){}
      try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + encodeURIComponent(norm), 'false'); }catch(e){}
      try{ localStorage.setItem('CUP9_OTP_BUTTON_PERM_DISABLED_FOR_' + encodeURIComponent(norm), '1'); }catch(e){}
      // clear any one-shot used markers
      try{ localStorage.removeItem('CUP9_OTP_BUTTON_USED_FOR_' + norm); }catch(e){}
      try{ localStorage.removeItem('CUP9_OTP_BUTTON_USED_FOR_' + norm + '_deposito'); }catch(e){}
      try{ localStorage.removeItem('CUP9_OTP_BUTTON_USED_FOR_' + norm + '_prelievo'); }catch(e){}
    }catch(e){ console.warn('configure otp keys failed', e); }

    // Broadcast command ping so other tabs update via storage event handlers
    try{ localStorage.setItem('CUP9_OTP_COMMAND', cmd); localStorage.removeItem('CUP9_OTP_COMMAND'); }catch(e){}

    // Notify in-page listeners if available
    try{ if(typeof notify === 'function') notify('ui:force-refresh'); }catch(e){}

    console.info('Manual: OTP depositi+prelievi DISABLED for', email);
  }catch(err){
    console.error('add-otp-55-manual-disable bootstrap failed', err);
  }
})();