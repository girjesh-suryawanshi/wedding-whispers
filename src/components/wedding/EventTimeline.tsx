import React, { useState } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { WeddingEvent, EventType, EVENT_LABELS } from '@/types/wedding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  GripVertical,
  Edit2
} from 'lucide-react';

export function EventTimeline() {
  const { wedding, addEvent, removeEvent, updateEvent } = useWedding();
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    type: 'haldi' as EventType,
    customName: '',
    date: undefined as Date | undefined,
    time: '10:00',
    venue: '',
  });

  if (!wedding) return null;

  const handleAddEvent = () => {
    if (!newEvent.date) return;
    
    const event: WeddingEvent = {
      id: crypto.randomUUID(),
      type: newEvent.type,
      customName: newEvent.type === 'custom' ? newEvent.customName : undefined,
      date: newEvent.date,
      time: newEvent.time,
      venue: newEvent.venue,
    };
    
    addEvent(event);
    setNewEvent({
      type: 'haldi',
      customName: '',
      date: undefined,
      time: '10:00',
      venue: '',
    });
    setIsAddingEvent(false);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;
    updateEvent(editingEvent.id, editingEvent);
    setEditingEvent(null);
  };

  const getEventLabel = (event: WeddingEvent) => {
    if (event.type === 'custom' && event.customName) {
      return event.customName;
    }
    return EVENT_LABELS[event.type].english;
  };

  const getEventEmoji = (type: EventType) => EVENT_LABELS[type].emoji;

  const eventTypes = Object.keys(EVENT_LABELS) as EventType[];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-foreground">Wedding Events</h2>
          <p className="text-sm text-muted-foreground">Plan your celebration timeline</p>
        </div>
        
        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogTrigger asChild>
            <Button className="btn-royal">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select 
                  value={newEvent.type} 
                  onValueChange={(value: EventType) => setNewEvent({ ...newEvent, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="flex items-center gap-2">
                          <span>{EVENT_LABELS[type].emoji}</span>
                          <span>{EVENT_LABELS[type].english}</span>
                          <span className="text-muted-foreground font-hindi text-sm">
                            ({EVENT_LABELS[type].hindi})
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newEvent.type === 'custom' && (
                <div className="space-y-2">
                  <Label>Custom Event Name</Label>
                  <Input
                    placeholder="Enter event name"
                    value={newEvent.customName}
                    onChange={(e) => setNewEvent({ ...newEvent, customName: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newEvent.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEvent.date ? format(newEvent.date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEvent.date}
                      onSelect={(date) => setNewEvent({ ...newEvent, date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Venue (Optional)</Label>
                <Input
                  placeholder="Enter venue"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                />
              </div>

              <Button 
                onClick={handleAddEvent} 
                disabled={!newEvent.date}
                className="w-full btn-royal"
              >
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {wedding.events.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
            <p className="text-muted-foreground">No events added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Event" to start planning</p>
          </div>
        ) : (
          wedding.events.map((event, index) => (
            <div
              key={event.id}
              className="group relative bg-card rounded-xl border border-border p-4 hover:shadow-soft transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Drag Handle */}
                <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Event Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-2xl">
                  {getEventEmoji(event.type)}
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {getEventLabel(event)}
                      </h3>
                      <p className="text-sm text-muted-foreground font-hindi">
                        {EVENT_LABELS[event.type].hindi}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog open={editingEvent?.id === event.id} onOpenChange={(open) => !open && setEditingEvent(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setEditingEvent(event)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-display">Edit Event</DialogTitle>
                          </DialogHeader>
                          {editingEvent && (
                            <div className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <Label>Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-left font-normal"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {format(new Date(editingEvent.date), "PPP")}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={new Date(editingEvent.date)}
                                      onSelect={(date) => date && setEditingEvent({ ...editingEvent, date })}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="space-y-2">
                                <Label>Time</Label>
                                <Input
                                  type="time"
                                  value={editingEvent.time}
                                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Venue</Label>
                                <Input
                                  placeholder="Enter venue"
                                  value={editingEvent.venue || ''}
                                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                                />
                              </div>

                              <Button onClick={handleUpdateEvent} className="w-full btn-royal">
                                Save Changes
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time}
                    </span>
                    {event.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.venue}
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline connector */}
                {index < wedding.events.length - 1 && (
                  <div className="absolute left-[4.25rem] sm:left-[5.75rem] top-full w-0.5 h-3 bg-border" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
