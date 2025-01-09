'use client'

import { Button } from '@nextui-org/button'

import { useAdmin } from '@/components/admin/AdminProvider'

export default function AdminLoginButton() {
  const { oAuth } = useAdmin()

  const onPressButton: Parameters<typeof Button>[0]['onPress'] = () => {
    oAuth?.signIn('polhem.us')
  }

  return (
    <div className="text-center">
      <Button
        onPress={onPressButton}
        disabled={!oAuth}
        className="my-16 font-sans"
        color="primary"
        size="lg"
      >
        Sign in with Bluesky
      </Button>
    </div>
  )
}
