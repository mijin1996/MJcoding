using UnityEngine;
using UnityEngine.EventSystems; // UI 체크를 위해 반드시 추가!

public class CameraFollow : MonoBehaviour {
    public Transform target;          // 따라갈 대상 (플레이어)
    public float distance = 7.0f;     // 플레이어와의 거리
    public float height = 3.0f;       // 높이
    public float smoothTime = 0.2f;   // 부드러운 정도 (낮을수록 빠름)

    private Vector3 currentVelocity;


    //public float sensitivity = 3.0f;  // 마우스 감도

    //private float currentX = 0.0f;    // 마우스 X축 회전량
    //private float currentY = 0.0f;    // 마우스 Y축 회전량

    void Start() {
        // 게임 시작 시 마우스 커서를 화면 중앙에 고정하고 숨깁니다. (ESC로 해제 가능)
//#if UNITY_EDITOR
//        Cursor.lockState = CursorLockMode.Locked;
//#endif

    }

    void LateUpdate() {
        if (target == null) return;

        Vector3 desiredForward = target.forward;
        desiredForward.y = 0f;


        Vector3 targetPosition = target.position - (target.forward * distance) + (Vector3.up * height);

        // 2. SmoothDamp를 이용한 부드러운 위치 이동
        // Lerp보다 가속/감속이 붙어 훨씬 고급스럽게 움직입니다.
        transform.position = Vector3.SmoothDamp(transform.position, targetPosition, ref currentVelocity, smoothTime);

        // 3. 카메라가 항상 캐릭터의 살짝 위(머리 쪽)를 바라보게 설정
        transform.LookAt(target.position + Vector3.up * 1.5f);








        //// --- 추가된 부분: 모바일/PC 통합 UI 터치 체크 ---
        //// 마우스 왼쪽 버튼(0) 혹은 터치(fingerId: 0)가 UI 위에 있다면 카메라 회전 스킵
        //if (IsPointerOverUI()) return;

        //// 1. 마우스 입력 받기 (이 부분이 화면을 돌리는 핵심입니다)
        ////if (Input.GetMouseButton(1))
        ////{
        //    //currentX += Input.GetAxis("Mouse X") * sensitivity;
        //    //currentY -= Input.GetAxis("Mouse Y") * sensitivity;
        ////}


        //// 2. 화면이 너무 위아래로 꺾이지 않게 각도 제한 (선택 사항)
        //currentY = Mathf.Clamp(currentY, 10f, 80f);

        //// 3. 회전 값 계산
        //Quaternion rotation = Quaternion.Euler(currentY, currentX, 0);

        //// 4. 카메라 위치 계산: 캐릭터 위치에서 회전된 방향으로 distance만큼 뒤로 이동
        //Vector3 direction = new Vector3(0, 0, -distance);
        //transform.position = target.position + (rotation * direction);

        //// 5. 카메라가 항상 캐릭터를 바라보게 설정
        //transform.LookAt(target.position + Vector3.up * 1.5f); // 캐릭터 머리 쪽을 보게 살짝 올림
    }


    // 모바일과 PC 모두에서 UI 터치를 감지하는 도우미 함수
    //private bool IsPointerOverUI()
    //{
    //    if (EventSystem.current == null) return false;

    //    // PC 마우스 검사
    //    if (EventSystem.current.IsPointerOverGameObject()) return true;

    //    // 모바일 터치 검사
    //    if (Input.touchCount > 0)
    //    {
    //        if (EventSystem.current.IsPointerOverGameObject(Input.GetTouch(0).fingerId))
    //            return true;
    //    }
    //    return false;
    //}

}
