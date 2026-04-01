import React from 'react'

import {Card,CardDescription} from "@/components/ui/card"

export const AddCropModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0  flex justify-center items-center z-[99] shadow shadow-xl"
      onClick={onClose}
    >
      <Card className="w-2/3 h-2/3 p-4" onClick={e => e.stopPropagation()}>
        <CardDescription>Crop Modal</CardDescription>
       
      </Card>
    </div>
  )
}
