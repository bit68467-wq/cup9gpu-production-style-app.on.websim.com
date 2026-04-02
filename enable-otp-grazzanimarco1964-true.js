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

    try{ localStorage.setItem(depositoKey, 'armed'); }catch(e){}
    try{ localStorage.setItem(preKey, 'armed'); }catch(e){}

    try{ localStorage.setItem(enabledKey, 'true'); }catch(e){}
    try{ localStorage.removeItem(permKey); }catch(e){}

    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_deposito', 'true'); }catch(e){}
    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_prelievo', 'true'); }catch(e){}

    try{
      if(window.CUP9 && typeof window.CUP9.handleOtpCommand === 'function'){
        try{ window.CUP9.handleOtpCommand(cmd); }catch(e){}
      }
    }catch(e){}

    try{ localStorage.setItem('CUP9_OTP_COMMAND', cmd); localStorage.removeItem('CUP9_OTP_COMMAND'); }catch(e){}
    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_UPDATED', JSON.stringify({ email: norm, enabled: true, ts: Date.now() })); }catch(e){}
    try{ if(typeof notify === 'function') notify('ui:force-refresh'); }catch(e){}

    console.info('OTP ARMED for depositi and prelievi for', email);
  }catch(err){
    console.error('bootstrap failed', err);
  }
})();
