from rest_framework.pagination import PageNumberPagination
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import ContactSerializer
from .models import Contact
import json
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes
    )



@api_view(['GET'])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def apiOverview(request):
    api_urls = {
        'List':'/contact_list/',
        'Detail View':'/contact_detail/<str:pk>/',
        'Create':'/contact_create/',
        'Update':'/contact_update/<str:pk>/',
        'Delete':'/contact_delete/<str:pk>/',
        }
    return Response(api_urls)


@api_view(['GET'])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def contact_list(request):
    paginator = PageNumberPagination()
    paginator.page_size = 2
    contacts = Contact.objects.all().order_by('-id')
    result_page = paginator.paginate_queryset(contacts, request)
    serializer = ContactSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def contact_search(request):
    data = json.loads(request.data['search_data'])
    objs = Contact.objects.all().order_by('-id')
    
    if data['search_id']:
        objs = objs.filter(id=data['search_id'])
    else:
        if data['search_first_name']:
            objs = objs.filter(first_name__icontains=data['search_first_name'])
        if data['search_last_name']:
            objs = objs.filter(last_name__icontains=data['search_last_name'])
        if data['search_phone']:
            objs = objs.filter(phone__icontains=data['search_phone'])
        if data['search_email']:
            objs = objs.filter(email__icontains=data['search_email'])

    serializer = ContactSerializer(objs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def contact_detail(request, pk:str):
    if not pk:
        return Response({'error': 'Method GET is not allowed'})
    
    if not pk.isdigit():
        return Response({'error': 'ID is not an integer'})
    
    try:
        contacts = Contact.objects.get(id=pk)
    except Contact.DoesNotExist:
        return Response({'error': 'Object does not exist'}, status=404)
    serializer = ContactSerializer(contacts, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def contact_create(request):
    data = json.loads(request.data['json_data'])
    serializer = ContactSerializer(data=data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def contact_update(request, pk):
    if not pk:
        return Response({'error': 'Method GET is not allowed'})
    
    if not pk.isdigit():
        return Response({'error': 'ID is not an integer'})

    data = json.loads(request.data['json_data'])
    try:
        contact = Contact.objects.get(id=pk)
    except Contact.DoesNotExist:
        return Response({'error': 'Object does not exist'}, status=404)
    
    serializer = ContactSerializer(instance=contact, data=data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def contact_delete(request, pk):
    if not pk.isdigit():
        return Response({'error': 'ID is not an integer'})
    
    if not pk:
        return Response({'error': 'Method GET is not allowed'})
    try:
        contact = Contact.objects.get(id=pk)
    except Contact.DoesNotExist:
        return Response({'error': 'Object does not exist'}, status=404)

    contact.delete()

    return Response('Contact successfully deleted!')
