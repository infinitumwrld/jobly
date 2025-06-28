'use client'

import { Menu, Transition } from '@headlessui/react'
import { Fragment, MouseEvent, memo } from 'react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import type { Interview, Feedback } from '@/types'

interface CardMenuProps {
  interview: {
    id: string
    role: string
    type: string
    techstack: string[]
    createdAt: string
  }
  feedback?: Feedback | null
  onDelete: () => void
  onDuplicate: () => void
  onShare: () => void
  onExport: () => void
  isExporting?: boolean
}

interface MenuItem {
  label: string
  icon: string
  onClick: () => void
  disabled: boolean
}

const CardMenu = ({ interview, feedback, onDelete, onDuplicate, onShare, onExport, isExporting = false }: CardMenuProps) => {
  const menuItems: MenuItem[] = [
    {
      label: 'Delete',
      icon: '🗑️',
      onClick: onDelete,
      disabled: false,
    },
    {
      label: 'Duplicate',
      icon: '📋',
      onClick: onDuplicate,
      disabled: false,
    },
    {
      label: 'Share',
      icon: '🔗',
      onClick: onShare,
      disabled: false,
    },
    {
      label: isExporting ? 'Generating PDF...' : 'Export to PDF',
      icon: isExporting ? '⏳' : '📄',
      onClick: onExport,
      disabled: !feedback || isExporting,
    },
  ]

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-white" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-white/5 rounded-lg bg-dark-200/80 backdrop-blur-xl shadow-lg focus:outline-none z-[100]">
        <div className="p-1">
          {menuItems.map((item) => (
            <Menu.Item key={item.label}>
              {({ active }) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    item.onClick()
                  }}
                  className={cn(
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2',
                    active ? 'bg-white/10 text-white' : 'text-gray-300',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={item.disabled}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  )
}

export default memo(CardMenu) 