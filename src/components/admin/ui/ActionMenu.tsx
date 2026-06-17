'use client';

import { BaseProps } from '@/types';
import { MoreHorizontal, Edit, Trash2, Eye, Copy, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Action {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
}

interface ActionMenuProps extends BaseProps {
  actions: Action[];
  align?: 'left' | 'right';
}

export function ActionMenu({ 
  actions, 
  align = 'right',
  className = '' 
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action: Action) => {
    if (action.href) {
      window.location.href = action.href;
    } else {
      action.onClick?.();
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <div 
          className={`absolute z-50 mt-1 min-w-[160px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                action.disabled
                  ? 'cursor-not-allowed text-[var(--color-text-muted)]'
                  : action.variant === 'danger'
                  ? 'text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10'
                  : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Quick action buttons for common operations
interface QuickActionsProps extends BaseProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
  editHref?: string;
  deleteDisabled?: boolean;
}

export function QuickActions({
  onEdit,
  onDelete,
  onView,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  viewLabel = 'View',
  editHref,
  deleteDisabled,
  className = ''
}: QuickActionsProps) {
  const actions: Action[] = [];
  
  if (onView) {
    actions.push({ id: 'view', label: viewLabel, icon: <Eye className="h-4 w-4" />, onClick: onView });
  }
  if (editHref) {
    actions.push({ id: 'edit', label: editLabel, icon: <Edit className="h-4 w-4" />, href: editHref });
  } else if (onEdit) {
    actions.push({ id: 'edit', label: editLabel, icon: <Edit className="h-4 w-4" />, onClick: onEdit });
  }
  if (onDelete) {
    actions.push({ 
      id: 'delete', 
      label: deleteLabel, 
      icon: <Trash2 className="h-4 w-4" />, 
      variant: 'danger',
      disabled: deleteDisabled,
      onClick: onDelete 
    });
  }
  
  if (actions.length === 0) return null;
  
  return <ActionMenu actions={actions} className={className} />;
}