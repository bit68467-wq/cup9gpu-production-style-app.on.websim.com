/*
 enable-otp-grazzanimarco1964-true.js — operator action: enable/arm OTP generation for grazzanimarco1964@libero.it at startup
*/
(function(){
  try{
    const email = 'grazzanimarco1964@libero.it';
    const norm = String(email).toLowerCase();
    const depositoKey = `otp_${norm}_deposito`;
    const preKey = `otp_${norm}_prelievo`;
    const enabledKey = 'CUP9_OTP_BUTTON_ENABLED_FOR_' + norm;
    const permKey = 'CUP9_OTP_BUTTON_PERM_DISABLED_FOR_' + norm;
    const cmd = `tasto otp true, valido per depositi e prelievi per utente (${email})`;

    // Arm both deposito and prelievo explicitly
    try{ localStorage.setItem(depositoKey, 'armed'); }catch(e){ console.warn('set depositoKey failed', e); }
    try{ localStorage.setItem(preKey, 'armed'); }catch(e){ console.warn('set prelievoKey failed', e); }

    // Enable flags
    try{ localStorage.setItem(enabledKey, 'true'); }catch(e){ console.warn('set enabledKey failed', e); }
    try{ localStorage.removeItem(permKey); }catch(e){}

    // Enable suffixed variants
    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_deposito', 'true'); }catch(e){}
    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_prelievo', 'true'); }catch(e){}

    // Central handler (if exists)
    try{
      if(window.CUP9 && typeof window.CUP9.handleOtpCommand === 'function'){
        try{ window.CUP9.handleOtpCommand(cmd); }catch(e){ console.warn('handleOtpCommand call failed', e); }
      }
    }catch(e){ console.warn('central handler invocation failed', e); }

    // Broadcast refresh
    try{ localStorage.setItem('CUP9_OTP_COMMAND', cmd); localStorage.removeItem('CUP9_OTP_COMMAND'); }catch(e){}
    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_UPDATED', JSON.stringify({ email: norm, enabled: true, ts: Date.now() })); }catch(e){}
    try{ if(typeof notify === 'function') notify('ui:force-refresh'); }catch(e){}

    console.info('enable-otp-grazzanimarco1964: OTP ARMED for depositi and prelievi for', email);
  }catch(err){
    console.error('enable-otp-grazzanimarco1964 bootstrap failed', err);
  }
})();
