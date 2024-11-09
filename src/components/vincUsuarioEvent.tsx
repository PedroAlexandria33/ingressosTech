import { db } from '@/server/apiFirebase'
import { doc, setDoc } from 'firebase/firestore'

// Função para vincular usuário ao evento
export async function vincularUsuarioEvento(userId: string, eventId: string) {
  try {
    await setDoc(
      doc(db, `participantes/${userId}`),
      { eventId },
      { merge: true }
    )
    console.log('Usuário vinculado ao evento com sucesso!')
  } catch (error) {
    console.error('Erro ao vincular usuário ao evento:', error)
    throw error // lança o erro para que ele seja tratado no arquivo principal
  }
}
