from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'is_read', 'created_at')
    search_fields = ('name', 'email', 'message')
    list_filter = ('is_read', 'created_at')
    readonly_fields = ('name', 'email', 'message', 'created_at')
    ordering = ('-created_at',)
    list_display_links = ('id', 'name')

    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"

    def change_view(self, request, object_id, form_url='', extra_context=None):
        obj = self.get_object(request, object_id)
        if obj and not obj.is_read:
            obj.is_read = True
            obj.save()

        return super().change_view(request, object_id, form_url, extra_context)