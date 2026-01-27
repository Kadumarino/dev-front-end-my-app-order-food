// ===============================================
// PULL TO REFRESH - Arrastar para baixo e recarregar
// ===============================================

(function() {
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let refreshThreshold = 80; // pixels necessários para ativar
  
  // Criar elemento de feedback visual
  const refreshIndicator = document.createElement('div');
  refreshIndicator.id = 'pull-refresh-indicator';
  refreshIndicator.innerHTML = '⬇️ Arraste para atualizar';
  refreshIndicator.style.cssText = `
    position: fixed;
    top: -60px;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(135deg, #7cb342, #689f38);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    z-index: 9999;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(refreshIndicator);
  
  // Detectar início do toque
  document.addEventListener('touchstart', (e) => {
    // Só ativa se estiver EXATAMENTE no topo da página (múltiplas verificações)
    const isAtTop = window.scrollY === 0 && 
                    document.documentElement.scrollTop === 0 && 
                    document.body.scrollTop === 0;
    
    if (isAtTop) {
      startY = e.touches[0].pageY;
      isDragging = true;
    }
  }, { passive: true });
  
  // Detectar movimento
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    // Verificar novamente se está no topo durante o movimento
    if (window.scrollY > 0 || document.documentElement.scrollTop > 0 || document.body.scrollTop > 0) {
      isDragging = false;
      refreshIndicator.style.transform = 'translateY(0)';
      return;
    }
    
    currentY = e.touches[0].pageY;
    const diff = currentY - startY;
    
    // Só funciona se arrastar para baixo E estiver no topo
    if (diff > 0) {
      const translateY = Math.min(diff * 0.5, refreshThreshold);
      refreshIndicator.style.transform = `translateY(${translateY + 60}px)`;
      
      // Alterar texto baseado na distância
      if (diff > refreshThreshold) {
        refreshIndicator.innerHTML = '🔄 Solte para atualizar';
        refreshIndicator.style.background = 'linear-gradient(135deg, #689f38, #558b2f)';
      } else {
        refreshIndicator.innerHTML = '⬇️ Arraste para atualizar';
        refreshIndicator.style.background = 'linear-gradient(135deg, #7cb342, #689f38)';
      }
    }
  }, { passive: true });
  
  // Detectar fim do toque
  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    
    // Verificar se ainda está no topo
    const isAtTop = window.scrollY === 0 && 
                    document.documentElement.scrollTop === 0 && 
                    document.body.scrollTop === 0;
    
    if (!isAtTop) {
      isDragging = false;
      refreshIndicator.style.transform = 'translateY(0)';
      startY = 0;
      currentY = 0;
      return;
    }
    
    const diff = currentY - startY;
    
    // Se ultrapassou o threshold, recarregar
    if (diff > refreshThreshold) {
      refreshIndicator.innerHTML = '🔄 Atualizando...';
      refreshIndicator.style.transform = `translateY(60px)`;
      
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      // Voltar para posição original
      refreshIndicator.style.transform = 'translateY(0)';
    }
    
    isDragging = false;
    startY = 0;
    currentY = 0;
  }, { passive: true });
  
  // Resetar indicador quando não estiver sendo usado
  document.addEventListener('scroll', () => {
    if (window.scrollY > 0 && !isDragging) {
      refreshIndicator.style.transform = 'translateY(0)';
    }
  }, { passive: true });
})();
