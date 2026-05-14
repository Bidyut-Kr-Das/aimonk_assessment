from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as st

from .models import Node
from .serializers import NodeSerializer
from .services import create_node,update_node
# Create your views here.

class NodeView(APIView):
    def get(self, request):
        nodes = Node.objects.all()
        return Response(
            NodeSerializer(nodes, many=True).data,
            status=st.HTTP_200_OK
        )
    def post(self, request):
        result = NodeSerializer(data=request.data)

        if result.is_valid():
            new_node = create_node(validated_data=result.validated_data)

            return Response(
                data=NodeSerializer(new_node).data,
                status=st.HTTP_201_CREATED
            )
        print(result.errors)
        return Response(
            result.errors,
            status=st.HTTP_400_BAD_REQUEST
        )
    
    def put(self, request):
        print(request.data.get("id"))
        
        try:
            node = Node.objects.get(
                id=request.data.get("id")
            )

        except Node.DoesNotExist:

            return Response(
                {"error": "Node does not exist"},
                status=st.HTTP_404_NOT_FOUND
            )
        result = NodeSerializer(
            node,
            data= request.data,
            partial=True
        )
        if result.is_valid():

            new_node = update_node(node,result.validated_data)

            return Response(
                NodeSerializer(new_node).data,
                status=st.HTTP_200_OK
            )
        
        return Response(
            {"error":result.errors},
            status=st.HTTP_400_BAD_REQUEST
        )
        

