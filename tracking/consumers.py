import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("🔥 CONNECT ATTEMPT START")

        user = self.scope.get("user")
        print("User in scope:", self.scope.get("user"))

        if not user or user.is_anonymous:
            print("❌ USER NOT AUTHENTICATED")
            await self.close()
            return

        self.user = user
        print(f"✅ CONNECTED USER: {self.user.id}")

        await self.accept()        
        
        await self.channel_layer.group_add(
            f"user_{self.user.id}",
            self.channel_name
        )
            
    async def disconnect(self, close_code):
        print("❌ WebSocket DISCONNECTED")

        if hasattr(self.user) and self.user.is_authenticated:
            await self.channel_layer.group_discard(
                f"user_{self.user.id}",
                self.channel_name
            )

    async def receive(self, text_data):
        print("📩 Message received:", text_data)

    
    async def send_tracking_update(self, event):
        await self.send(
            text_data=json.dumps(event["data"])
        )

    async def send_tracking_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))