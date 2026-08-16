const lockClass = 'is-lock'

document.addEventListener('click', event => {
  const target = event.target
  if (!(target instanceof Element)) return

  const opener = target.closest('[data-modal-open]')
  if (opener) {
    const modal = document.getElementById(opener.getAttribute('data-modal-open'))
    if (modal) {
      document.querySelector('.main-menu.is-open [data-js-main-menu-toggle]')?.click()
      modal.showModal()
      document.documentElement.classList.add(lockClass)
    }
  }

  const closer = target.closest('[data-modal-close]')
  if (closer) closer.closest('dialog')?.close()

  if (target instanceof HTMLDialogElement) target.close()
})

document.addEventListener('close', () => {
  if (!document.querySelector('dialog[open]')) {
    document.documentElement.classList.remove(lockClass)
  }
}, true)
