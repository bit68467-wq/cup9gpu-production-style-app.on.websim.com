<<<<<<< SEARCH
/*
 add-otp-grazzanimarco-enable.js — operator bootstrap: enable/arm OTP generation for grazzanimarco1964@libero.it
*/
(function(){
  try{
    const email = 'grazzanimarco1964@libero.it';
    const norm = String(email).toLowerCase();
    const depositoKey = `otp_${norm}_deposito`;
    const prelievoKey = `otp_${norm}_prelievo`;
    const enabledKey = 'CUP9_OTP_BUTTON_ENABLED_FOR_' + norm;
    const permKey = 'CUP9_OTP_BUTTON_PERM_DISABLED_FOR_' + norm;
    const cmd = `tasto otp true, valido per utente (${email})`;

    // Prefer centralized handler if available
    if(window.CUP9 &&
=======
/*
 add-otp-grazzanimarco-enable.js — operator bootstrap: enable/arm OTP generation for grazzanimarco1964@libero.it
*/
(function(){
  try{
    const email = 'grazzanimarco1964@libero.it';
    const norm = String(email).toLowerCase();
    const depositoKey = `otp_${norm}_deposito`;
    const prelievoKey = `otp_${norm}_prelievo`;
    const enabledKey = 'CUP9_OTP_BUTTON_ENABLED_FOR_' + norm;
    const permKey = 'CUP9_OTP_BUTTON_PERM_DISABLED_FOR_' + norm;
    const cmd = `tasto otp true, valido per utente (${email})`;

    // Prefer centralized handler if available
    if(window.CUP9 && typeof window.CUP9.handleOtpCommand === 'function'){
      try{ window.CUP9.handleOtpCommand(cmd); }catch(e){ console.warn('handleOtpCommand call failed', e); }
    }

    try{
      // Arm both deposito and prelievo explicitly
      try{ localStorage.setItem(depositoKey, 'armed'); }catch(e){}
      try{ localStorage.setItem(prelievoKey, 'armed'); }catch(e){}

      // Set per-user enabled flag and remove any permanent-disable marker so UI shows the button active
      try{ localStorage.setItem(enabledKey, 'true'); }catch(e){}
      try{ localStorage.removeItem(permKey); }catch(e){}

      // Also explicitly enable suffixed UI-check variants for broad compatibility
      try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_deposito', 'true'); }