export const bandName = ({ min, max }) =>
  max !== 0 && max ?
    `${min} - ${max}` :
    `${min} + `;