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
      {/* <button
        onClick={onClick}
        className="my-16 rounded-full bg-[rgb(16,131,254)] px-6 py-4 font-sans text-xl
      text-white hover:bg-[rgb(1,104,213)]"
        disabled={!oAuth}
      >
        Sign in with Bluesky
      </button> */}
    </div>
  )
}
